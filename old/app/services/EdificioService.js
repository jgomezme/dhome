angular.module('DigitalHomes').factory('EdificioService', function($http, ConexionService){
	var url = ConexionService.url;
	return {
		getEdificio : function(buildingId){
			return $http.get(url+'api/Building/'+buildingId);
		}
	}
});
