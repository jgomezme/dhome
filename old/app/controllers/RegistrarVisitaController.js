angular.module('DigitalHomes').controller('RegistrarVisitaController', function($scope, $rootScope, localStorageService, VisitasService){
	
	$rootScope.bodyClass = 'trama';

	$scope.registrarVisita = function(){
		var SuiteId = localStorageService.get('seleccionados').seleccionados;
		var data = {Company : $scope.visita.empresa, VisitName : $scope.visita.nombre, VisitIdentification : $scope.visita.identidad, Reason : $scope.visita.busqueda, SuiteId : SuiteId};
		VisitasService.registrarVisita(data)
		.then(
			function(response){
				console.log(response);
				if (response.status == 200) {
					alert('Visita Registrada!');
					$scope.visita = {};
				}
			},
			function(response){
				console.log(response);
			}
		);
	}
});