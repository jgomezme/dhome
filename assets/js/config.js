var app = angular.module('dhome', ['ngMaterial', 'ui.router', 'ngMdIcons']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {


  $httpProvider.interceptors.push(function(){
        return {
           'request': function(config) {
                // $httpProvider.defaults.withCredentials = true;                

                $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.token;  // common
 
                for(x in config.data){
                    if(typeof config.data[x]  ===  'boolean'){
                        config.data[x] += '';
                    }
                }

                return config || $q.when(config);

            },
            'response': function(response) {
                
                //do something 

                console.log(response,'response rq');

               return response;
            },
            'responseError' : function(err){ //usamos los interceptors para manipular los errores
              
                if(window.config.env.match('qa|dev')){ //solo mostramos el error en caso de que el entorno sea dev
                    console.log('Error: ', err, 'Codigo: ', err.status);
                }

                if(err.status === 401){ //manejamos autorizacion
                    window.location = 'login.html';
                }

                return err;

            }
        };
    });



   $stateProvider
    .state('visitas', {
      url: "/visitas",
      templateUrl: "views/visitas.html",
      controller : visitasCtrl
    }) 
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller : mainCtrl
    }) 
    .state('nueva-visita', {
      url: "/nueva-visita",
      templateUrl: "views/login.html",
      controller : visitasCtrl
    }) 
    ;
     
 	 
 	$urlRouterProvider.otherwise("/visitas");

 });

/*
    }, ['uiGmapGoogleMapApi', function(GoogleMapApiProviders){
    
         GoogleMapApiProvider.configure({ });
          }]);

*/


app.run(function($rootScope, $mdSidenav, $mdBottomSheet, $state){

	$rootScope.$on('$viewContentLoaded', 
			function(event, toState, toParams, fromState, fromParams){ 	

        console.log($state);		   	           


				 $rootScope.state = $state.current.name;
			    		   

			    $mdBottomSheet.hide();
  				$mdSidenav("right").close();
			 
			});

 $rootScope.backcounter = 0;

  $rootScope.$on('$stateChangeSuccess', 
              function(event, toState, toParams, fromState, fromParams){ 
                
              $rootScope.back = fromState.name != '' && toState.name != '' ? true : false;                  
              $rootScope.backcounter++;

               console.log($rootScope.back, 'back')

           });



    $rootScope.goback = function(){
      window.history.back();
      $rootScope.backcounter--;
      if($rootScope.backcounter === 0)
         $rootScope.back = false;
    }

	

})

