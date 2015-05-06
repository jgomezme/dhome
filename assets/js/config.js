var app = angular.module('dhome');

app.config(function($stateProvider, $urlRouterProvider, $httpProvider, $mdThemingProvider) {

    // theming

    $mdThemingProvider.definePalette('dhomePalette', {
        '50': 'ffebee',
        '100': '287D7D',
        '200': 'ef9a9a',
        '300': 'e57373',
        '400': 'ef5350',
        '500': '287D7D',
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
    $mdThemingProvider.theme('default')
        .primaryPalette('dhomePalette')


    $httpProvider.interceptors.push(function() {
        return {
            'request': function(config) {
                $httpProvider.defaults.withCredentials = true;

                if (!window.localStorage.token)
                    window.location = "index.html";

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
        .state('nueva-visita', {
            url: "/nueva-visita",
            templateUrl: "views/nueva_visita.html",
            controller: visitasCtrl,
            data:{title:'visita'}
        })
        .state('correspondencias', {
            url: "/correspondencias",
            templateUrl: "views/correspondencias.html",
            controller: visitasCtrl,
            data : {title:'correspondencias'}            
        })
        .state('nueva-correspondencia', {
            url: "/nueva-correspondencia",
            templateUrl: "views/nueva_correspondencia.html",
            controller: mainCtrl,
            data : {title:'Correspondencia'}            
        })
        .state('home', {
            url: "/home",
            templateUrl: "views/selection.html",
            controller: buildingCtrl,
            data : {title:'home'}                             
        });


    $urlRouterProvider.otherwise("/home");

});


/*
    }, ['uiGmapGoogleMapApi', function(GoogleMapApiProviders){
    
         GoogleMapApiProvider.configure({ });
          }]);

*/


app.run(function($rootScope, $mdSidenav, $mdBottomSheet, $state) {

    $rootScope.$on('$viewContentLoaded',
        function(event, toState, toParams, fromState, fromParams) {

            console.log($state);


            $rootScope.state = $state.current.name;


            $mdBottomSheet.hide();
            $mdSidenav("right").close();


    $rootScope.backcounter = 0;

    $rootScope.$on('$stateChangeSuccess',
        function(event, toState, toParams, fromState, fromParams) {

            $rootScope.back = fromState.name != '' && toState.name != '' ? true : false;
            $rootScope.backcounter++;
            $rootScope.pageTitle = toState.data.title || 'Home';


            console.log($rootScope.back, 'back')

        });



    $rootScope.goback = function() {
        window.history.back();
        $rootScope.backcounter--;
        if ($rootScope.backcounter === 0)
            $rootScope.back = false;
    }



})

  })
;
