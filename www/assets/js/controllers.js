// controllers 
function detalleVisitaController($scope,$rootScope, $stateParams, $http, $API, $mdBottomSheet){
  $mdBottomSheet.hide(); 
    $scope.load = function(){
        $API
        .visit($stateParams.id)
        .get()
        .success(function(visita){
            $scope.current_visit = visita || [];
            console.log(visita)
        });
    }



}

function detalleCorrespondenciaController($scope, $stateParams, $API, $mdBottomSheet, $storage){
  $mdBottomSheet.hide(); 
  
  $scope.load = function(){
      $API
      .correspondence($storage.get('config').buildingId)
      .get()
      .success(function(correspondences){
        $scope.values = correspondences || [];
      }); 
  }
}


function dashboardController($scope){

}


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

//compress image in frontend with canvas

function resizeMe(img, max_width, max_height) {
  
  var canvas = document.createElement('canvas');

  var width = img.width;
  var height = img.height;


  // calculate the width and height, constraining the proportions
  if (width > height) {
    if (width > max_width) {
      //height *= max_width / width;
      height = Math.round(height *= max_width / width);
      width = max_width;
    }
  } else {
    if (height > max_height) {
      //width *= max_height / height;
      width = Math.round(width *= max_height / height);
      height = max_height;
    }
  }
  
  // resize the canvas and draw the image data into it
  canvas.width = width;
  canvas.height = height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, width, height);
  
  
  return canvas.toDataURL("image/jpeg",0.7); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}

var map_error = {
   "invalid_grant" : "Usuario o contraseña no validos."
}


function mainCtrl($scope, $rootScope, $window, $mdDialog, $mdSidenav, $api, $mdMedia, $mdBottomSheet, $state, $API, $storage, $location, $mdToast){

       //handling device ready
       

      document.addEventListener('deviceready', function(){
         console.log(cordova.plugins)
         
      })




  $rootScope.nothing="No asignado"

   $rootScope.resetSuite = function(){
     delete $rootScope.suite;
    }

  $rootScope.resetSuiteTower = function(){
     delete $rootScope.suite;
     delete $rootScope.tower;
  }


  $rootScope.resetTower = function(){
     delete $rootScope.tower;
     delete $rootScope.toall;
  }


 $rootScope.toast = function(message, close){

   function toastCtrl($scope, $mdToast){
      $scope.closeToast = function() {
         $mdToast.hide();
       };
   }

    $mdToast.show({
      controller: toastCtrl,
      templateUrl: '<md-toast><span flex>'+message+'</span><md-button ng-click="closeToast()">'+close+'</md-button></md-toast>',
      hideDelay: 6000,
      position: {
          bottom: false,
          top: true,
          left: false,
          right: true
        }

    });

 }



  

      $scope.checkLogin = function(){
              if($storage.get('token'))
                window.location = 'app.html';
              else
                $scope.nolog = true;
      }

      function previewPhoto(n){
           
           if(!n)
               return;

           $rootScope.loading = true;                        
           delete $rootScope.photosrc;
           
           window.URL = window.URL || window.webkitURL;
           
           var blob = n.match('://')  ? n : window.URL.createObjectURL(n);         
                   
           //compress image

           var img = new Image();
           img.src = blob;

           img.onload = function(){

               $rootScope.$apply(function(){
               $rootScope.photosrc = resizeMe(img,350,350);           
               $rootScope.loading=false; 

             });
               

           }
           
           
       }

      

       $rootScope.$watch('photo', previewPhoto);


    
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

      'use strict'; 

        if(!$scope.form)
            {
               $scope.error_login = "Todos los campos son requeridos";
               return;
            }

        $scope.form.grant_type="password";
        $scope.form.login_type="door";
   
         console.log($scope.form)

          //window.location = "app.html";
          $API
          .login()          
          .post("login_type=door&grant_type=password&username="+$scope.form.username+"&password="+$scope.form.password, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
          .success(function(rs){
              console.log(rs);
              $storage.save('config',rs);  
              $storage.save('token', rs.access_token)     
              $scope.loged=true;                
              window.location = "app.html";
              $rootScope.loading = false 
          })
          .error(function(err){
            console.log(err)
              $scope.error_login = map_error[err.error.toLowerCase()];
              $rootScope.loading = false 
          })

    }

    $scope.logout = function(){
         $storage.delete('config');
         $storage.delete('token');

         window.location.reload();
    }


  $rootScope.stats = function(){

    alert('hey')

     $API
     .visitsall($storage.get('config').buildingId)
      .get()
      .success(function(rs){

        $rootScope.vaprobadas = 0;
        $rootScope.vnoparobadas = 0;
          for(x in rs)
             if(rs[x].State === "")
                $rootScope.vnoparobadas++;
              else
                $rootScope.vaprobadas++;

      })


  }
  


}


function logedCtrl($rootScope, $storage, $API){

     
$scope.userinfo = function(){
      $API
       .user()
       .get()
       .success(function(rs){
           $rootScope.user = rs;
           $rootScope.username = rs.FisrtName + ' ' + rs.LastName;
       });
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


function buildingCtrl($scope, $rootScope, $storage, $API, $stateParams, $mdBottomSheet, $state){

   $scope.building = $storage.get('config').buildingId;



    document.addEventListener('deviceready', function(){
         StatusBar.show();
      });





    var lookAtSel = function(){



         if($rootScope.selected)
            for(x in $rootScope.selected)
                $scope.values[$scope.values.indexOf($rootScope.selected[x])].checked=true;
     }


    $scope.towerBottomSheet = function() {  
   
    $rootScope.tower = this.value;  


    console.log($rootScope.tower, 'the tower')
    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/tower.html'
    })
    .then(function(){ 
          

       $mdBottomSheet.hide();
    }, function(){

      
      $mdBottomSheet.hide();
    })
    ;

  };

 $scope.iniSel = function(){
     $rootScope.selected = new Array();
 }


  $scope.selectAll = function(){

    $rootScope.selected = [];

     for(x in $scope.values)
         { 
          $scope.values[x].checked=true;
          $rootScope.selected.push($scope.values[x])
         }
        $rootScope.toall=true;

  }


  $scope.delSelected = function(){
      for(x in $scope.values)
          $scope.values[x].checked=false;

      $rootScope.selected = new Array();
  }


  $scope.suiteBottomSheet = function() {  
   
    $rootScope.suite = this.value; 

    console.log($rootScope.suite,'suite')     
    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/suite.html'
    })
    .then(function(){ 
         
      
       $mdBottomSheet.hide();
    }, function(){
       
      
      $mdBottomSheet.hide();
    })
    ;

  };


  $scope.loadView = function(){    

        
        if($scope.thebuilding.Towers.length > 1)
            window.location = "#/home/towers";
        else
            window.location = "#/home/suites";

  }


   $scope.load = function(callback){

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


      var loadSuites = function(){


      $scope.values = [];
      $scope.suites = [];


        if($state.params.id)
        {



         var containsTower = function(id, towers){

          console.log(towers)
     
              for(x in towers)
                if(towers[x].Id === parseInt(id))
                  return towers[x];
                
              

              return false;
          }

        

          var tower = containsTower($state.params.id, $scope.thebuilding.Towers);

          console.log(tower, 'id');



          for(x in tower.Floors) 
            for(j in tower.Floors[x].Suites)
           if(typeof tower.Floors[x].Suites[j] === 'object' )
              $scope.values.push({tower:{Name : tower.Name, Id: tower.Id}, suite:tower.Floors[x].Suites[j]});   
            
            
            $rootScope.pageTitle =   tower.Name;


            console.log($scope.values);

     lookAtSel()

          return;
        }

        for(var x in $scope.thebuilding.Towers)
              for(var j in $scope.thebuilding.Towers[x].Floors)                 
                  for(var n in $scope.thebuilding.Towers[x].Floors[j].Suites)
                   $scope.values.push({tower: {Name : $scope.thebuilding.Towers[x].Name, Id: $scope.thebuilding.Towers[x].Id}, suite : $scope.thebuilding.Towers[x].Floors[j].Suites[n]});  
                           
                 
            console.log($scope.values, $scope.suites)

           lookAtSel()

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



function visitasCtrl($scope, $rootScope, $mdBottomSheet, $stateParams, $api, $storage, $location, $state, $API) {

    delete $rootScope.photo;
  
 $mdBottomSheet.hide();

  $scope.centerBottomSheet = function(val) {  
    $rootScope.currentVisit = val;
     
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

        $API
       .visitsall(parseInt($storage.get('config').buildingId))
       .get()
       .success(function(rs){
           console.log(rs);
           $scope.values = rs;
       });

   }


   $scope.add = function(){

     var data = new FormData();
         data.append('file', $rootScope.photosrc)

      $API
      .file($storage.get('config').buildingId)
      .post(data, {'Content-Type' : undefined})
      .success(function(rs){
           console.log(rs, 'file')

           $scope.form.ImageName = rs;
           $scope.form.CustomData = $scope.form.CustomData || {};
           $scope.form.CustomData.tower = $rootScope.suite.tower.Name;
           $scope.form.CustomData.suite = $rootScope.suite.suite.Name;

            $API
            .post_visit($rootScope.suite.suite.Id)
            .post($scope.form)
            .success(function(rs){
               console.log(rs, 'visit');
               $rootScope.toast('Visita Registrada', 'Cerrar');
               delete $scope.form;
               window.location = '#/visitas'
            })

      })

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
          console.log(error)
      }
   );
     }

}


function correspondenceCtrl($scope, $rootScope, $API, $storage, $mdBottomSheet){

  delete $rootScope.photo;

  $scope.centerBottomSheet = function(val) {
    $rootScope.correspondence = val;

    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/correspondenceBottom_sheet.html'
    })
    .then(function(){ 
       $mdBottomSheet.hide();
    }, function(){
      $mdBottomSheet.hide();
    })
    ;

  };


  $scope.takeimage = function(){
     document.getElementById('correspondence').click()
   }

    $scope.load = function(){
      $API
      .correspondencesall($storage.get('config').buildingId)
      .get()
      .success(function(correspondences){
        $scope.values = correspondences || [];
      });
    }

    $scope.add = function(){

        var to = $rootScope.toall ? [] : $rootScope.selected || $rootScope.suite.suite.Id;

        if(typeof to === 'array')
            {
              _to = [];

              for(x in to)
                _to.push(to[x].suite.Id);

              to = _to;
              delete _to;
              console.log(to);
            }

        $scope.form.SuitesId = to;
        delete to;

      var data = new FormData();
      data.append('file', $rootScope.photosrc)

      $API
      .file($storage.get('config').buildingId)
      .post(data, {'Content-Type' : undefined})
      .success(function(rs){
         

        $API
        .correspondence($storage.get('config').buildingId)
        .post($scope.form)
        .success(function(rs){
             console.log(rs, 'correspondence')
               delete $scope.form;
             
           window.location = "#/correspondencias";
        })

      });


    }

}


angular.module('dhome')
.controller('mainCtrl', mainCtrl)
.controller('entityCtrlBase', entityCtrlBase)
.controller('buildingCtrl', buildingCtrl)
.controller('correspondenceCtrl', correspondenceCtrl)
.controller('dashboardController', dashboardController)
.controller('detalleVisitaController', detalleVisitaController)
.controller('detalleCorrespondenciaController', detalleCorrespondenciaController)
.controller('logedCtrl', logedCtrl)
;

