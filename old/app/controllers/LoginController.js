angular.module('DigitalHomes').controller('LoginController', function($scope, $modal, $state, LoginService, localStorageService){
	$scope.openLogin = function(){
		$modal.open({
			templateUrl : '/views/modals/login.html',
			windowTemplateUrl : '/views/modals/modal-override.html',
			scope : $scope
		});
	};

	$scope.login = function(usuario, password){
		console.log('login');
		var data = {usuario : usuario, password : password};
		LoginService.login(data)
		.then(
			function(response){
				if (response.status == 200) {
					localStorageService.set('authorizationData', { token: response.data.access_token });
					localStorageService.set('building', {_id : response.data.buildingId});
					$state.go('home.inicio');
					//console.log(response.data);
				}else{
					console.log(response);
				}
			},
			function(response){
				console.log("Error", response);
			}
		);
	}

	$scope.openLogin();
});