function storage(){

		
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


function API($http,$rootScope){

	  var config = window.config[window.config.env];
	  this.baseUrl = config.apiUrlBase + config.apiBaseUri;
	  this.url = "";

	  this.login = function(id){ $rootScope.loading = true; if(!id) this.url = config.apiUrlBase + "/token"; else this.url = this.baseUrl + "/token/" + id; return this; }
	  this.building = function(id){ if(!id) this.url = this.baseUrl + "/building"; else this.url = this.baseUrl + "/building/" + id; return this; }
	  this.visit = function(id){ if(!id) this.url = this.baseUrl + "/visitis"; else this.url = this.baseUrl + "/visits/" + id; return this; }
	  this.post_visit = function(id){  this.url = this.baseUrl + "/visitis?suiteid=" + id; return this; }
	 
	  this.correspondence = function(id){ this.url = this.baseUrl + "/correspondence?BuildingId="+id; return this; }
	  this.correspondencee = function(id){ if(!id)this.url = this.baseUrl + "/correspondence"; else this.url = this.baseUrl + "/correspondence/"+id; return this; }
	  
	  this.visitsall = function(id){ this.url = this.baseUrl + "/visitis/bybuilding/" + id+"?page=1&pageSize=500"; return this; }
	  this.correspondencesall = function(id){ this.url = this.baseUrl + "/correspondence/ByBuilding/" + id+"?page=1&pageSize=500"; return this; }
	  this.user = function(){ this.url = this.baseUrl + "/account/userinfo"; return this; }
	  this.file = function(id){ this.url = this.baseUrl + "/images?buildingid="+id; return this; }
	  this.notices = function(id){ this.url = this.baseUrl + "/notices?buildingid="+id; return this; }
	  this.noticess = function(id){ this.url = this.baseUrl + "/notices/"+id; return this; }
	  this.noticesss = function(){ this.url = this.baseUrl + "/notices"; return this; }
	  this.deliver = function(){ this.url = this.baseUrl + "/deliveries"; return this; }
	  this.correspondenceStats = function(id){ this.url = this.baseUrl + "/correspondence/summary/" + id;  return this; }



	  this.add = function(comp){ this.url += comp; return this;  }
	  this.reset = function(){ this.url = ""; }

	  this.get = function(){ var url = this.url; this.reset(); return $http.get(url); }
	  this.post = function(data, header){  var url = this.url; this.reset(); return $http.post(url, data || {}, header || { headers : {'Content-Type': 'application/json'} }); }
	  this.put = function(data){ var url = this.url; this.reset(); return $http.put(url, data || {}); }	  
	  this.delete = function(){ var url = this.url; this.reset(); return $http.delete(url); }
	  

	  return this;

}



angular.module('dhome')
       .factory('$storage', storage)
       .factory('$API', API)
       ;