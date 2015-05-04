angular.module('DigitalHomes').factory('VisitasService', function($http, ConexionService){

	var url = ConexionService.url;

	return {
		registrarVisita : function(data){
			return $http.post(url+'api/Visitis?SuiteId='+data.SuiteId, data);
		},
		getVisitasAutorizadas : function(SuiteId){
			return $http.get(url+'api/Visitis/Authorizeds?SuiteId='+SuiteId);
		}
	}
});