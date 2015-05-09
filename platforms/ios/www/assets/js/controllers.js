// controllers 


String.prototype.ellipsis = function(limit){

   var limit = limit || 50;

   if(this.length < 50 )
    return this+'';
   
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

var map_error = {
   "invalid_client" : "Usuario o contraseña no validos."
}


function mainCtrl($scope, $rootScope, $window, $mdDialog, $mdSidenav, $api, $mdMedia, $mdBottomSheet, $state, $API, $storage){

       //handling device ready

        document.addEventListener('deviceready', function(){
         console.log(JSON.stringify(cordova.plugins))
         
      })

     

       $rootScope.$watch('photo', function(n){
           
           if(!n)
               return;
            var reader = new FileReader();
            
           delete $rootScope.photosrc;
           
           reader.readAsDataURL(n);
                   
           
           reader.onload = function(e){               
                $rootScope.photosrc = e.target.result;
           };
       })

    
        $scope.values = []; 

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


    if(window.config.env.match('dev'))
    {
      $scope.form = {};
      $scope.form.username = 1047;
      $scope.form.password = "C0ntr4";
    }

    $scope.login = function(){  

        if(!$scope.form)
            {
               $scope.error_login = "Todos los campos son requeridos";
               return;
            }

        $scope.form.grant_type="password";
        $scope.form.login_type="door";
   

          //window.location = "app.html";
          $API
          .login()          
          .post("login_type=door&grant_type=password&username="+$scope.form.username+'&password='+$scope.form.password, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
          .success(function(rs){
              console.log(rs);
              $storage.save('config',rs);  
              $storage.save('token', rs.access_token)                     
              window.location = "app.html";    
          })
          .error(function(err){
            console.log(err)
            $scope.error_login = map_error[err.error.toLowerCase()];
          })



    }

    $scope.logout = function(){
         $storage.delete('config');
         $storage.delete('token');

         window.location.reload();
    }


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



function buildingCtrl($scope, $rootScope, $storage, $API, $stateParams, $mdBottomSheet){

   $scope.building = $storage.get('config').buildingId;

    document.addEventListener('deviceready', function(){
         StatusBar.show();
      });



    $scope.towerBottomSheet = function() {  
   
    $rootScope.tower = $rootScope.tower || this.value;  
    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/tower.html',
      scope : $scope,
      preserveScope : true
    })
    .then(function(){ 
         if(!$state.current.name.match('home'))    
       delete $rootScope.tower;

       $mdBottomSheet.hide();
    }, function(){
         if(!$state.current.name.match('home'))          
      delete $rootScope.tower; 
      
      $mdBottomSheet.hide();
    })
    ;

  };


  $scope.suiteBottomSheet = function() {  
   
    $rootScope.suite = $rootScope.suite || this.value;  
    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/suite.html',
      scope : $scope,
      preserveScope : true
    })
    .then(function(){ 
         if(!$state.current.name.match('home'))    
       delete $rootScope.suite;

       $mdBottomSheet.hide();
    }, function(){
         if(!$state.current.name.match('home'))          
      delete $rootScope.suite; 
      
      $mdBottomSheet.hide();
    })
    ;

  };


  $scope.loadView = function(){    

        
        if($scope.thebuilding.Towers.length > 0)
            window.location = "#/home/towers";
        else
            window.location = "#/home/suites";

  }


   $scope.load = function(callback){


    console.log($scope.building);


       $API
       .building($scope.building)       
       .get()       
       .success(function(rs){

           console.log(rs, 'javier');

           $scope.thebuilding = rs;


           if(callback)
               callback(rs);
            else
              $scope.loadView();

       })
       .error(function(err){
         console.log(err, 'javier');

         if(callback)
               callback(false);
       })

   }



   $scope.getTowers = function(){
    

       if(!$scope.thebuilding)
         $scope.load(function(rs){
            if(rs)
             $scope.values = $scope.thebuilding.Towers;              
         })
       else
          $scope.values = $scope.thebuilding.Towers;


   }

   $scope.getFloors = function(){
      
      if(!$scope.thebuilding)
         $scope.load(function(rs){
            if(rs)
              $scope.values = $scope.thebuilding.floors;              
         })
      else
          $scope.values = $scope.thebuilding.floors;

   }

   $scope.getSuites = function(){  

      $scope.values = [];
      $scope.suites = [];

      var loadSuites = function(){

  console.log($stateParams)
        if($stateParams.tower)
        {

          var tower = $scope.thebuilding.Towers[$scope.thebuilding.Towers.indexOf({Id:$stateParams.tower})];

          console.log(tower, 'id');

          for(x in tower.Floors) 
            for(j in tower.Floors[x].Suites)
             $scope.values.push(tower.Floors[x].Suites[j]);     

          return;
        }

        for(var x in $scope.thebuilding.Towers)
              for(var j in $scope.thebuilding.Towers[x].Floors)                 
                  for(var n in $scope.thebuilding.Towers[x].Floors[j].Suites)
                   $scope.values.push($scope.thebuilding.Towers[x].Floors[j].Suites[n]);  
                           
                 

            console.log($scope.values, $scope.suites)
      }

      if(!$scope.thebuilding)
          $scope.load(function(rs){

            if(rs)
               loadSuites();
          });
      else
        loadSuites();


       
   }


}




function visitasCtrl($scope, $rootScope, $mdBottomSheet, $stateParams, $api, $storage, $location, $state) {
  
$scope.takeimage = function(){
     document.getElementById('visit').click()
   }



        $scope.photoChanged = function() {
          
          var oFReader = new FileReader();

          console.log($scope.photo, 'photo');
          return;
          

           angular.element(this).scope().fileChanged(this);

           console.log(this)
           
           oFReader.readAsDataURL(document.getElementById('visit').files[0]);


           oFReader.onload = function (oFREvent) {
            alert('hey')
             $scope.previewImage = oFREvent.target.result;
           };

        };

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

            $scope.values = $storage.get('favorites') || [];
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

       var favorites = $storage.get('favorites') || [];
       favorites.push($rootScope.center || this.value);

       $storage.save('favorites',favorites);       

       $mdBottomSheet.hide()
       .then(function(){        

           $rootScope.alerta({title:'Nuevo Visitante Frecuente',content:'Se añadió ' + ($rootScope.center.name || this.value.name ) + ' a visitantes frecuentes.'})

       });

   }


   $scope.unfavorite = function(){

       var favorites = $storage.get('favorites') || [];

       console.log(favorites,'get');

       favorites.splice(favorites.indexOf($rootScope.center || this.value),1);

       if(favorites.length > 0)
       $storage.save('favorites', favorites);
       else
       $storage.delete('favorites')

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
       window.location  = '#/centers';
             console.log($rootScope.center)
             $scope.center = $rootScope.center;

   }


   $scope.isfavorite = function(){

        var myfavorites = $storage.get('favorites') || [];  

      console.log(myfavorites.indexOf(this.value));

         return myfavorites.indexOf(this.value) != -1;

   }

   $scope.goToProfile = function(){

        $rootScope.center = this.value;

        window.location = '#/profile';

   }

   $scope.loadProfile = function(){

     if(!$rootScope.center)
       window.location = '#/centers';

       $scope.center = $rootScope.center;

   }

   $scope.loadCenterMap = function(){     
      $gmap.load();
   }
   
   
   $scope.scanId = function(){
       
       cordova.plugins.barcodeScanner.scan(
      function (result) {
          $rootScope.alerta({title: "Readed" , content: "We got a barcode\n" +
                          "Result: " + result.text + "\n" +
                          "Format: " + result.format + "\n" +
                          "Cancelled: " + result.cancelled});
      }, 
      function (error) {
          $rootScope.alerta({title:"Error",content:"Scanning failed: " + error});
      }
   );
     }

}



function citasCtrl($scope, $rootScope, $stateParams, $state, $location, $storage){

   $scope.load = function(id){

      $scope.values = $storage.get('citas') || [];

   }

   $scope.create = function(data){

    

      var data = data || $scope.form;

      var citas = $storage.get('citas') || [];

      data.status = 'pending';
      data.center = $rootScope.center || data.center;

      citas.push(data);

      console.log(citas)

      $storage.save('citas',citas);

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


angular.module('dhome')
.controller('mainCtrl', mainCtrl)
.controller('entityCtrlBase', entityCtrlBase)
.controller('buildingCtrl', buildingCtrl)
;



