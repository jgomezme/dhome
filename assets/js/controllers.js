// controllers 
var app = angular.module('dhome');

String.prototype.ellipsis = function(limit){

	 var limit = limit || 50;
	 
	 var st = (this + '').substring(0,limit);
	 var complete = '';

	 if(this[limit] != ' ')
	 	for(i=limit;i<this.length;i++)
	 		if(this[i] != ' ')
	 			complete += this[i];
	 		else
	 			break;
	st = st + complete + '...';	 		

	return st;

}


function mainCtrl($scope, $rootScope, $window, $mdDialog, $mdSidenav, $api, $mdMedia, $mdBottomSheet, $state){


			  $rootScope.alerta = function(data){

			  		var data = data || {};

			  		$mdDialog.show(
			    		$mdDialog.alert()
			    		.title(data.title || 'Mensaje')
			    		.content(data.content || '')
			    		.ariaLabel('alerta')
			    		.ok(data.ok || 'Ok')
			    		)

			  }
			

			 if(window.history.length > 0)
			 	 $scope.back = true;
	  		 
	  		 
		      	$scope.menu_right = function(){
		        	$mdSidenav("right").toggle();
		      	}

			  	$rootScope.requetsAmbulance = function(ev) {

			  		if(this.value)
			  			 $rootScope.center = this.value;

			  	var content = (!$rootScope.center) ? 
			    	'Desea solicitar una ambulancia al centro de salud mas cercano?' :
			    	'Desea solicitar una ambulancia a ' + $rootScope.center.name + ' mas cercano(a)? '  

			   
			    $mdDialog.show(
			      $mdDialog.confirm()
			        .title('Solicitar Ambulancia')
			        .content(content)
			        .ariaLabel('Solicitar')
			        .ok('Aceptar')	
			        .cancel('Cancelar')		        
			        .targetEvent(ev)
			    	)
			    .then(function(){			    	

			    	var content = (!$rootScope.center) ? 
			    	'Se ha solicitado una ambulancia a su ubicación. Por favor mantenga su dispositivo móvil cerca mientras llega la ayuda médica.' :
			    	'Se ha solicitado a ' + $rootScope.center.name + ' una ambulancia a su ubicación. Por favor mantenga su dispositivo móvil cerca mientras llega la ayuda médica.' 

			    	$mdDialog.show(
			    		$mdDialog.alert()
			    		.title('Ambulancia Solicitada.')
			    		.content(content)
			    		.ariaLabel('solicitada')
			    		.ok('Ok')
			    		)
			    	.then(function(){
                    if(!$state.current.name.match('profile'))   				    		
			    		  delete $rootScope.center;
		        		  $mdSidenav("right").close();

			    	})

			    }, function(){
			        //
         if(!$state.current.name.match('profile'))   	
			    		  delete $rootScope.center;
			    })
			    ;

    	$mdBottomSheet.hide();


	       		};	   

     $scope.showAlertLeft = function(ev) {
	    $mdDialog.show(
	      $mdDialog.alert()
	        .title('Swipe')
	        .content('Haz hecho swipe left.')
	        .ariaLabel('Swipe')
	        .ok('Aceptar')
	        .targetEvent(ev)
	    );
    };




}



	

function entityCtrlBase($scope, $rootScope, $stateParams){

   $scope.load = function(id){

   	  var id = id || $scope.id;

   }

   $scope.create = function(data){

   	  var data = data || $scope;

   }

   $scope.update = function(id){

   	  var id = id || $scope.id;


   }

   $scope.delete = function(id){

   	  var id = id || $scope.id;


   }
}






function visitasCtrl($scope, $rootScope, $mdBottomSheet, $stateParams, $api, $localStorage, $location, $state) {
  
   
  $scope.centerBottomSheet = function() {  
   
    $rootScope.center = $rootScope.center || this.value;	
    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/center.html',
      scope : $scope,
      preserveScope : true
    })
    .then(function(){ 
         if(!$state.current.name.match('profile'))   	
    	 delete $rootScope.center;

    	 $mdBottomSheet.hide();
    }, function(){
         if(!$state.current.name.match('profile'))   	    	
    	delete $rootScope.center;	
    	
    	$mdBottomSheet.hide();
    })
    ;

  };


   $scope.load = function(params){

   

   	var params = params || {};

   	    if(params.favorites)
   	    	{

   	    		$scope.values = $localStorage.get('favorites') || [];
   	    		return;
   	    	}



   	      $api
		   .centers()
		   .get()
		   .success(function(rs){
		   	   console.log(rs);
		   	   $scope.values = rs.data;

		   });

   }

   $scope.favorite = function(){

   	   var favorites = $localStorage.get('favorites') || [];
   	   favorites.push($rootScope.center || this.value);

   	   $localStorage.save('favorites',favorites);   	   

   	   $mdBottomSheet.hide()
   	   .then(function(){   	   	

   	   	   $rootScope.alerta({title:'Nuevo Favorito',content:'Se añadió ' + ($rootScope.center.name || this.value.name ) + ' a tus favoritos.'})

   	   });

   }


   $scope.unfavorite = function(){

   	   var favorites = $localStorage.get('favorites') || [];

   	   console.log(favorites,'get');

   	   favorites.splice(favorites.indexOf($rootScope.center || this.value),1);

   	   if(favorites.length > 0)
   	   $localStorage.save('favorites', favorites);
   	   else
   	   $localStorage.delete('favorites')

   	 if($rootScope.center)
   	   $scope.load({favorites:true})
   	else
   		$scope.load();

   	   $mdBottomSheet.hide()
   	   .then(function(){   	   	

   	   	   $rootScope.alerta({title:'Favorito Eliminado',content:'Se quitó ' + ($rootScope.center.name || this.value.name ) + ' de tus favoritos.'})

   	   });
     ;


   }


   $scope.call = function(){
             if(!$rootScope.center)
   	 	 $location.path('/centers').replace();
             console.log($rootScope.center)
             $scope.center = $rootScope.center;

   }


   $scope.isfavorite = function(){

        var myfavorites = $localStorage.get('favorites') || [];  

     	console.log(myfavorites.indexOf(this.value));

   	     return myfavorites.indexOf(this.value) != -1;

   }

   $scope.goToProfile = function(){

   	    $rootScope.center = this.value;

   	    $location.path('/profile').replace();

   }

   $scope.loadProfile = function(){

   	 if(!$rootScope.center)
   	 	 $location.path('/centers').replace();

   	   $scope.center = $rootScope.center;

   }

   $scope.loadCenterMap = function(){   	
   	  $gmap.load();
   }



}



function citasCtrl($scope, $rootScope, $stateParams, $state, $location, $localStorage){

   $scope.load = function(id){

   	  $scope.values = $localStorage.get('citas') || [];

   }

   $scope.create = function(data){

   	

   	  var data = data || $scope.form;

   	  var citas = $localStorage.get('citas') || [];

   	  data.status = 'pending';
   	  data.center = $rootScope.center || data.center;

   	  citas.push(data);

   	  console.log(citas)

   	  $localStorage.save('citas',citas);

   	  $rootScope.alerta('Nueva Cita', 'Se ha creado una nueva cita.')
   	  .then(function(){

   	  $location.path('citas').replace();
   	  	

   	  });

   }

   $scope.update = function(id){

   	  var id = id || $scope.id;


   }

   $scope.delete = function(id){

   	  var id = id || $scope.id;


   }


    $scope.centerCita = function(){
   	  $scope.center = $rootScope.center;
   }


}




app
.controller('mainCtrl', mainCtrl)
.controller('entityCtrlBase', entityCtrlBase)
;



