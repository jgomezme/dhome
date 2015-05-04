angular.module('DigitalHomes').factory('CorrespondenciaService', function($http, ConexionService){

	var url = ConexionService.url;

	return {
		recibirCorrespondencia : function(correspondencia, BuildingId){
			return $http.post(url+'api/Correspondence?BuildingId='+BuildingId, correspondencia);
		},
		getCorrespondenciaPendiente : function(SuiteId){
			return $http.get(url+'api/Correspondence?SuiteId='+SuiteId)
		},
		solicitudCorrespondencia : function(data){
			return $http.post(url+'api/Deliveries', data);
		}
	}

});