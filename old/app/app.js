var app = angular.module('DigitalHomes', ['ui.router', 'ngAnimate', 'ui.bootstrap', 'LocalStorageModule']);

app.config( function($stateProvider, $urlRouterProvider, $httpProvider, localStorageServiceProvider){
	
	$urlRouterProvider.otherwise('/home/login');
	$httpProvider.interceptors.push(function($window, $location, $q, localStorageService){
    return {
      request: function(config) {
        if (localStorageService.get('authorizationData')) {
            var token = localStorageService.get('authorizationData').token;
            if (token) {
              config.headers.Authorization = 'Bearer ' + token;
            }
        }
        return config
      },
     responseError : function(response){
        if(response.status === 401 || response.status === 403) {
            //$location.path('/login');
            alert("Unauthorized");
        }
        return $q.reject(response);
      },
      response: function(response) {
        return response
      }
    }
  });

	localStorageServiceProvider
  .setPrefix('CargoApp')
  .setStorageCookie(0)
  .setNotify(true, true);

	$stateProvider
		.state('home',{
			url : '/home',
			//abstract : true,
			template : '<div ui-view id="home"></div>',
      controller : 'HomeController'
		})
		.state('home.login',{
			url : '/login',
			templateUrl : '/views/login.html',
			controller : 'LoginController'
		})
    .state('home.inicio',{
      url : '/inicio',
      templateUrl : '/views/portero-main.html',
      controller : 'InicioController'
    })
    .state('home.recibir-correspondencia',{
      url : '/recibir-correspondencia',
      templateUrl : '/views/recibir-correspondencia.html',
      controller : 'RecibirCorrespondenciaController'
    })
    .state('home.correspondencia-pendiente',{
      url : '/correspondencia-pendiente',
      templateUrl : '/views/correspondencia-pendiente.html',
      controller : 'CorrespondenciaPendienteController'
    })
    .state('home.registrar-visita',{
      url : '/registrar-visita',
      templateUrl  : '/views/registrar-visita.html',
      controller : 'RegistrarVisitaController'
    })
    .state('home.visitas-autorizadas',{
      url : '/visitas-autorizadas',
      templateUrl : '/views/visitas-autorizadas.html',
      controller : 'VisitasAutorizadasController'
    })
});
