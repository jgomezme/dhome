function localStorage(){

		
	this.get = function(key){
		  
		  if(window.localStorage[key])
		  return window.localStorage[key].match('[{|}]') ? JSON.parse(window.localStorage[key]) : window.localStorage[key];
		  else 
		  return undefined;
	}

	this.save = function(key, value){
        window.localStorage[key] = typeof value  === 'object' ? JSON.stringify(value) : value;
	}

	this.update = function(key, value){
        window.localStorage[key] = window.localStorage[key].match('[{|}]') ? JSON.stringify(value) : value;
	}

	this.delete = function(key){
		 delete window.localStorage[key];
	}

	return this;
}


function API($http){

	  var config = window.config[window.config.env];
	  this.baseUrl = config.apiUrlBase + config.apiBaseUri;
	  this.url = "";

	  this.login = function(id){ if(!id) this.url = config.apiUrlBase + "/token"; else this.url = this.baseUrl + "/token/" + id; return this; }
	  this.building = function(id){ if(!id) this.url = this.baseUrl + "/building"; else this.url = this.baseUrl + "/building/" + id; return this; }
	  this.add = function(comp){ this.url += comp; return this;  }
	  this.reset = function(){ this.url = ""; }

	  this.get = function(){ var url = this.url; this.reset(); return $http.get(url); }
	  this.post = function(data, header){ var url = this.url; this.reset(); return $http.post(url, data || {}, header || {}); }
	  this.put = function(data){ var url = this.url; this.reset(); return $http.put(url, data || {}); }	  
	  this.delete = function(){ var url = this.url; this.reset(); return $http.delete(url); }
	  

	  return this;

}



angular.module('dhome')
       .factory('$localStorage', localStorage)
       .factory('$API', API)
       ;