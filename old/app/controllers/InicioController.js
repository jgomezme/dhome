var app = angular.module('DigitalHomes');


app.controller('InicioController', function($scope, $state, $modal, $rootScope, localStorageService, EdificioService){
	

	$rootScope.bodyClass = "";
	localStorageService.set("seleccionados", null);

	$scope.torres = [];
	$scope.pisos = [];
	$scope.apartamentos = [];
	$scope.seleccionados = [];

	$scope.openSeleccionMultiple = function(){
		$scope.reset();
		$modal.open({
			templateUrl : '/views/modals/seleccion-multiple-apartamentos.html',
			windowTemplateUrl : '/views/modals/modal-override.html',
			scope : $scope,
			controller : 'SeleccionMultipleController'
		});
	};

	$scope.openAcciones = function(apartamento){
		if (apartamento) {
			$scope.seleccionados.push(apartamento.Id);
		}
		$modal.open({
			templateUrl : '/views/modals/seleccion-acciones.html',
			windowTemplateUrl : '/views/modals/modal-override.html',
			scope : $scope,
			controller : 'AccionesController'
		});
	};

	$scope.getEdificio = function(){
		var buildingId = localStorageService.get('building') ? localStorageService.get('building')._id : null;
		if (buildingId) {
			EdificioService.getEdificio(buildingId)
			.then(
				function(response){
					if (response.status == 200) {
						$scope.getTorres(response.data.Towers);
						//console.log($scope.torres);
					}
				},
				function(response){
					console.log(response);
				}
			);
		}
	}();

	$scope.getTorres = function(torres){
		$scope.torres = _.map(torres, function(torre){
			return {nombre : torre.Name, _id : torre.Id, pisos : torre.Floors, numPisos : torre.Floors.length};
		});
	}

	$scope.getPisos = function(torre){
		$scope.pisos = _.chain($scope.torres)
						.findWhere({ '_id' : torre._id })
						.result('pisos')
						.map(function(piso){
							return {_id : piso.Id, apartamentos : piso.Suites};
						})
						.value();
		console.log($scope.pisos);
	};

	$scope.getApartamentos = function(piso){
		$scope.apartamentos = _.result(_.findWhere($scope.pisos, {'_id' : piso.Id}), 'apartamentos');
		return $scope.apartamentos;
	};


	$scope.reset = function(){
		$scope.seleccionados = [];
		_.each($scope.pisos, function(piso){
			_.each(piso.apartamentos, function(apartamento){
				apartamento.selected = false;
			});
		});
	}

	$scope.goToRecibirCorrespondencia = function(){
		localStorageService.set("seleccionados",{seleccionados : $scope.seleccionados});
		$state.go('home.recibir-correspondencia');
	}

});


app.controller('AccionesController', function($state, $scope, localStorageService){

	$scope.goToRecibirCorrespondencia = function(){
		localStorageService.set("seleccionados",{seleccionados : $scope.seleccionados});
		$state.go('home.recibir-correspondencia');
	}

	$scope.goToCorrespondenciaPendiente = function(){
		localStorageService.set("seleccionados", {seleccionados : $scope.seleccionados[0]});
		$state.go('home.correspondencia-pendiente');
	}

	$scope.goToRegistrarVisita = function(){
		localStorageService.set("seleccionados", {seleccionados : $scope.seleccionados[0]});
		$state.go('home.registrar-visita');
	}

	$scope.goToVisitasAutorizadas = function(){
		localStorageService.set("seleccionados", {seleccionados : $scope.seleccionados[0]});
		$state.go('home.visitas-autorizadas');
	}
});


app.controller('SeleccionMultipleController', function($scope, $state, localStorageService){
	
	$scope.seleccionMultiple = function(apartamento){
		
		if (!_.includes($scope.seleccionados, apartamento.Id)) {
			$scope.seleccionados.push(apartamento.Id);
			apartamento.selected = true;
		}else{
			apartamento.selected = false;
			_.remove($scope.seleccionados, function(item){
				return item == apartamento.Id;
			});
		}

		console.log($scope.seleccionados, apartamento);
	};

	$scope.goToRecibirCorrespondencia = function(){
		localStorageService.set("seleccionados",{seleccionados : $scope.seleccionados});
		$state.go('home.recibir-correspondencia');
	}
});