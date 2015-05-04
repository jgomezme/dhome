angular.module('DigitalHomes').factory('LoginService', function($http, ConexionService){
	var url = ConexionService.url;
	return {
		login : function(loginData){
			var data = "login_type=door&grant_type=password&username=" + loginData.usuario + "&password=" + loginData.password;
			return $http.post(url+'token', data,{
				headers : {'Content-Type' : 'application/x-www-form-urlencoded'}
			});
		}
	}
});
