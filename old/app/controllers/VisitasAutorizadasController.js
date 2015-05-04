angular.module('DigitalHomes').controller('VisitasAutorizadasController', function($scope, $rootScope, localStorageService, VisitasService){

	$rootScope.bodyClass = 'trama';
	$scope.visitas = [];

	$scope.getVisitasAutorizadas = function(){
		var SuiteId = localStorageService.get('seleccionados').seleccionados;
		VisitasService.getVisitasAutorizadas(SuiteId)
		.then(
			function(response){
				console.log(response);
				$scope.visitas = response.data;
			},
			function(response){
				console.log(response);
			}
		);
	}();

});