angular.module('DigitalHomes').controller('HomeController', function($rootScope, $state, $modalStack){
	$rootScope.goToInicio = function(){
		$state.go('home.inicio');
	}

	$rootScope.$on("$stateChangeStart", function(){
		$modalStack.dismissAll();
	});
});