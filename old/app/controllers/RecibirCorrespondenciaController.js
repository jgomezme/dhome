angular.module('DigitalHomes').controller('RecibirCorrespondenciaController', function($scope, $rootScope, localStorageService, CorrespondenciaService){
	$rootScope.bodyClass = 'trama';
	$scope.correspondencia = null;
	$scope.current = Date.now();

	console.log(localStorageService.get("seleccionados"));

	$scope.recibirCorrespondencia = function(){
		var apartamentos = localStorageService.get("seleccionados");
		var BuildingId = localStorageService.get('building')._id;
		var correspondencia = {Observations : $scope.correspondencia.descripcion, To : $scope.correspondencia.para, SuitesId : apartamentos.seleccionados};
		console.log(correspondencia);
		CorrespondenciaService.recibirCorrespondencia(correspondencia, BuildingId)
		.then(
			function(response){
				console.log(response);
				if (response.status == 200) {
					alert('Correspondencia registrada!');
					$scope.correspondencia = {};
				}
			},
			function(response){
				console.log(response);
			}
		);
	}

});