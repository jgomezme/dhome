angular.module('DigitalHomes').controller('CorrespondenciaPendienteController', function($scope, $rootScope, localStorageService, CorrespondenciaService){
		
	$rootScope.bodyClass = 'trama';
	$scope.correspondencia = null;
	$scope.seleccionadas = {};
	$scope.Ids = [];


	$scope.getCorrespondenciaPendiente = function(){
		var SuiteId = localStorageService.get('seleccionados').seleccionados;
		CorrespondenciaService.getCorrespondenciaPendiente(SuiteId)
		.then(
			function(response){
				console.log(response);
				$scope.correspondencias = response.data;
			},
			function(response){
				console.log(response);
			}
		);
	}();


	$scope.setSeleccionadas = function(){
		var Ids = [];
		_.each($scope.seleccionadas, function(item,i){
			var i = parseInt(i);
			if (item) {
				
				Ids.push(i);
				
			}else{

			}
		});
		angular.copy(Ids, $scope.Ids);
	}
	
	$scope.solicitudCorrespondencia = function(){
		if ($scope.Ids.length > 0) {
			var SuiteId = localStorageService.get('seleccionados').seleccionados;
			var data = {To : $scope.destinatario, SuiteId : SuiteId, CorrespondencesIds : $scope.Ids};
			CorrespondenciaService.solicitudCorrespondencia(data)
			.then(
				function(response){
					console.log(response);
					if (response.status == 200) {
						alert('Correspondencia Asignada!');
						$scope.destinatario = "";
						$scope.seleccionadas = {};
					}
				},
				function(response){
					console.log(response);
				}
			);
		}else{
			alert("Seleccione una correspondencia");
		}
	}
});