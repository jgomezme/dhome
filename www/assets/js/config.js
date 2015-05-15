
angular.module('dhome')
.config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {


    $mdThemingProvider.definePalette('dhomePalette', {
        '50': 'ffebee',
        '100': '287D7D',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': '3606C3',
        '600': 'e53935',
        '700': 'd32f2f',
        '800': 'c62828',
        '900': 'b71c1c',
        'A100': 'ff8a80',
        'A200': 'ff5252',
        'A400': 'ff1744',
        'A700': 'd50000',
        'contrastDefaultColor': 'light',

        'contrastDarkColors': ['50', '100',
            '200', '300', '400', 'A100'
        ],
        'contrastLightColors': undefined
    });

    $mdThemingProvider
    .theme('default')
    .primaryPalette('dhomePalette');


    $httpProvider.interceptors.push(function($injector) {

        rootScope = $injector.get('$rootScope');

        return {
            'request': function(config) {
                
                rootScope.loading = true;
                

                $httpProvider.defaults.withCredentials = true;

                if (!window.localStorage.token)
                    window.location = "index.html";

                console.log(config, 'request')

                if(config.data)
                if(config.data.CustomData)
                      config.data.CustomData = JSON.stringify(config.data.CustomData);


                $httpProvider.defaults.headers.common['Authorization'] = 'Bearer ' + window.localStorage.token; // common

                for (x in config.data) {
                    if (typeof config.data[x] === 'boolean') {
                        config.data[x] += '';
                    }
                }

                return config || $q.when(config);

            },
            'response': function(response) {

                //do something 

                if (window.config.env.match('qa|dev'))
                    console.log(response, 'response rq');

                rootScope.loading = false;

                if(response.data)
                if(response.data.CustomData)
                      response.data.CustomData = JSON.parse(response.data.CustomData);
                

                return response;
            },
            'responseError': function(err) { //usamos los interceptors para manipular los errores

                if (window.config.env.match('qa|dev')) { //solo mostramos el error en caso de que el entorno sea dev
                    console.log('Error: ', err, 'Codigo: ', err.status);
                }

                if (err.status === 401) { //manejamos autorizacion
                    window.localStorage.clear();
                    window.location = 'index.html';
                }

                rootScope.loading = false;
                

                return err;

            }
        };
    });


    $stateProvider
        .state('visitas', {
            url: "/visitas",
            templateUrl: "views/visitas.html",
            controller: visitasCtrl,
            data : {title:'visitas'}
        })
        .state('detalle_visitas', {
            url: "/detalle_visita/:id",
            templateUrl: "views/detalle_visita.html",
            controller: detalleVisitaController,
            data : {title:'Detalle de Visita'}
        })
        .state('detalle_correspondencia', {
            url: "/detalle_correspondencia",
            templateUrl: "views/detalle_correspondencia.html",
            controller: detalleCorrespondenciaController,
            data : {title:'Detalle Correspondecia'}
        })
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",
            controller: dashboardController,
            data : {title:'Inicio'}                             
        })
        .state('nueva-visita', {
            url: "/nueva-visita",
            templateUrl: "views/nueva_visita.html",
            controller: visitasCtrl,
            data:{title:'Nueva visita'}            
        }) 
        .state('enviar-inbox', {
            url: "/enviar-inbox",
            templateUrl: "views/enviar_inbox.html",
            controller: mainCtrl,
            data : {title:'Enviar mensaje'}
        }) 
         .state('cambiar-contrasena', {
            url: "/cambiar-contrasena",
            templateUrl: "views/cambiar_contrasena.html",
            controller: mainCtrl,
            data : {title:'Cambiar contraseña'}
        })     
         .state('perfil', {
            url: "/perfil",
            templateUrl: "views/perfil.html",
            controller: mainCtrl,
            data : {title:'Perfil'}
        })   
        .state('inboxs', {
            url: "/inboxs",
            templateUrl: "views/inboxs.html",
            controller: visitasCtrl,
            data : {title:'Mensajes'}            
        })      
         .state('correspondencias', {
            url: "/correspondencias",
            templateUrl: "views/correspondencias.html",
            controller: correspondenceCtrl,
            data : {title:'Correspondencias'}            
        })
        .state('nueva-correspondencia', {
            url: "/nueva-correspondencia",
            templateUrl: "views/nueva_correspondencia.html",
            controller: correspondenceCtrl,
            data : {title:'Nueva correspondencia'}            
        })
        .state('home', {
            url: "/home",
            templateUrl: "views/building.html",
            controller: buildingCtrl,
            data : {title: '' }                             
        })
        .state('home.towers', {
            url: "/towers",
            templateUrl: "views/building/towers.html",
            controller: buildingCtrl,
            data : {title: '' }                             
        })
        .state('home.tower', {
            url: "/tower/:id",
            templateUrl: "views/building/suites.html",
            controller: buildingCtrl,
            data : {title:'Apartamentos'}                             
        })
        .state('home.suites', {
            url: "/suites",
            templateUrl: "views/building/suites.html",
            controller: buildingCtrl,
            data : {title:'Apartamentos'}                             
        })


    $urlRouterProvider.otherwise("/home"); //aqui va?



})

.run(function($rootScope, $mdSidenav, $mdBottomSheet, $state, $timeout, $mdUtil, $log) {


    $rootScope.$on('$stateChangeStart', 
        function(event, toState, toParams, fromState, fromParams){ 
            $rootScope.loading = true;

            alert(toState)
           
    });

    $rootScope.$on('$viewContentLoaded',
        function(event, toState, toParams, fromState, fromParams) {

            console.log($state);

            $rootScope.state = $state.current.name;
            alert(toState)
            
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID) {
      var debounceFn =  $mdUtil.debounce(function(){
            $mdSidenav(navID)
              .toggle()
              .then(function () {
                $log.debug("toggle " + navID + " is done");
              });
          },300);

      return debounceFn;
    }

        //$mdBottomSheet.hide();
        $mdSidenav("right").close();
        $rootScope.backcounter = 0;

         })


    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {

            $rootScope.back = fromState.name != '' && toState.name != '' ? true : false;
            $rootScope.backcounter++;
            $rootScope.pageTitle = toState.data.title || 'Home';
            $rootScope.loading = false


            console.log($rootScope.back, 'back')

        });


    $rootScope.goback = function() {
        window.history.back();
        $rootScope.backcounter--;
        if ($rootScope.backcounter === 1)
            $rootScope.back = false;
    }

    $rootScope.loading = "Cargando...";

})
;

