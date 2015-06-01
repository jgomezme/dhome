

// controllers 
function detalleVisitaController($scope,$rootScope, $stateParams, $http, $API, $mdBottomSheet){
  $mdBottomSheet.hide(); 
    $scope.load = function(){
        $API
        .visit($stateParams.id)
        .get()
        .success(function(visita){
            $scope.current_visit = visita || [];
            $scope.current_visit.CustomData = JSON.parse($scope.current_visit.CustomData);
            console.log(visita)
        });
    }

}

function detalleCorrespondenciaController($scope, $stateParams, $API, $mdBottomSheet, $storage){
  $mdBottomSheet.hide(); 
  
  $scope.load = function(){
    console.log($stateParams);
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
  
  
  return canvas.toDataURL(); // get the data from canvas as 70% JPG (can be also PNG, etc.)

}


var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  }


function mainCtrl($scope, $rootScope, $window, $mdDialog, $mdSidenav, $api, $mdMedia, $mdBottomSheet, $state, $API, $storage, $location, $mdToast){

       //handling device ready
        $mdBottomSheet.hide();

      document.addEventListener('deviceready', function(){
         console.log(cordova.plugins)
         
      })

  moment.locale('es');
  $scope.moment = moment;
  $scope.Home = {};
  $scope.Home.show = true;

  $rootScope.platform = (window.cordova) ? window.cordova.platformId : 'web';

  $rootScope.hideBS = function(){
      $mdBottomSheet.hide();
  }

   $scope.totime = function(){

   if(this.value.CustomData)
     this.value.CustomData = JSON.parse(this.value.CustomData);

     console.log(this.value.VisitName.split(' ')[0].split(''))

    if(this.value.VisitName != null) 
     this.value.inits = this.value.VisitName.split(' ')[0].split('')[0] || 'V';
    else
      this.value.inits = 'V';


    if(!this.value.inits)
       this.value.inits = 'V';

     console.log(this.CustomData, "custom")
     this.value.VisitDate = new Date(this.value.RegisterDate).getTime();
 }


    $rootScope.iniSel = function(){
       $rootScope.selected = new Array();
    }






 $rootScope.gohome = function(){


     if(window.location.hash.match('home')){
      window.location.reload();
        return;      
     }

     window.location = "#/home/suites";


 }



 $scope.parseCustom = function(){
  
   if(this.value.CustomData)
     this.value.CustomData = JSON.parse(this.value.CustomData);

   if(this.value.CorrespondenceDate)
     this.value.CorrespondenceDate = new Date(this.value.CorrespondenceDate).getTime();

   if(this.value.To)
      this.value.inits = this.value.To.split(' ')[0].split('')[0] || 'C';
   

    if(!this.value.inits)
       this.value.inits = 'C';


 }


 $scope.parseCustomm = function(){

    if(this.value.Correspondence.CustomData)
     this.value.Correspondence.CustomData = JSON.parse(this.value.Correspondence.CustomData);

    if(!this.value.inits)
       this.value.Correspondence.inits = 'C';
 }

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

           console.log(n);
           
           window.URL = window.URL || window.webkitURL;
           
           var blob = window.cordova ? n : window.URL.createObjectURL(n);                  
                   
           //compress image

           var img = new Image();
           img.src = blob;

           img.onload = function(){

               $rootScope.$apply(function(){

               $rootScope.photosrc = resizeMe(img,350,350); 
               console.log($rootScope.photosrc, 'resize');

                console.log(dataURLToBlob($rootScope.photosrc), 'blob yeah')

                $rootScope.loading=false; 

             });
               

           }
           
           
       }

      

       $rootScope.$watch('photo', previewPhoto);


    
        $scope.values = []; 

        $rootScope.alerta = function(title, content, ok){


            return $mdDialog.show(
              $mdDialog.alert()
              .title(title || 'Mensaje')
              .content(content || '')
              .ariaLabel('alerta')
              .ok(ok || 'Ok')
              );

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

      $scope._form = {};


    if(window.config.env.match('dev'))
    {
      $scope._form.username = 1047;
      $scope._form.password = "C0ntr4";
    }

     var pushNotification = '';

    
    document.addEventListener('deviceready', function(){

       pushNotification = window.plugins.pushNotification;


    });


    $scope.login = function(){  

      'use strict'; 

        if(!$scope._form)
            {
               $scope.error_login = "Todos los campos son requeridos";
               return;
            }

        $scope._form.grant_type="password";
        $scope._form.login_type="door";
   
         console.log($scope._form)

          //window.location = "app.html";

          $API
          .login()          
          .post("login_type=door&grant_type=password&username="+$scope._form.username+"&password="+$scope._form.password, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
          .success(function(rs){
             
              console.log(rs, 'login');
              $storage.save('config',rs);  
              $storage.save('token', rs.access_token)     
              $rootScope.loged=true;          
              delete $scope._form;   

               

               // window.location = "app.html";


              var successHandler = function(rs){

                
              }

              var errorHandler = function(err){
                  console.log(err)
              }


            

               function tokenHandler (result) {
 
                           alert('device token = ' + result);

                               $API
                                  .register(rs.Registration)
                                  .put({
                                    Handle : e.regid,
                                    platform : 'apns',
                                    BuildingId : $storage.get('config').buildingId
                                  })
                                  .success(function(rs){
                                         console.log('dispositivo registrado');
                                         window.location = "app.html";

                                       
                                  })

                     }



         window.onNotification = function(e) {



                    switch( e.event )
                    {
                    case 'registered':
                        if ( e.regid.length > 0 )
                        {


                               $API
                                  .register()
                                  .post({
                                    Handle : e.regid,
                                    platform : 'gcm',
                                    BuildingId : $storage.get('config').buildingId
                                  }, {headers : {Authorization : 'Bearer ' + rs.access_token}} )
                                  .success(function(rs){
                                         console.log('dispositivo registrado');
                                         window.location = "app.html";
                                  })

                        }
                    break;

                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if ( e.foreground )
                        {
                          

                            // on Android soundname is outside the payload.
                            // On Amazon FireOS all custom attributes are contained within payload
                            var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            var my_media = new Media("/android_asset/www/"+ soundfile);
                            my_media.play();
                        }
                    

                       $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');

                       var action = e.payload.message.split('/');
                    
                    break;

                    case 'error':
                       console.log(e.msg );
                    break;

                    default:
                        console.log('unknow action');
                    break;
             }
        }



        window.onNotificationAPN = function(event) {
            if ( event.alert )
            {
                navigator.notification.alert(event.alert);
            }

            if ( event.sound )
            {
                var snd = new Media(event.sound);
                snd.play();
            }

            if ( event.badge )
            {
                pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
            }
        }

   

      if(window.cordova)    
      {    
       if ( $rootScope.platform == 'android' || $rootScope.platform == 'Android' || $rootScope.platform == "amazon-fireos" )
                  pushNotification.register(
                  successHandler,
                  errorHandler,
                  {
                      "senderID":"148915533168",
                      "ecb":"window.onNotification"
                  });
       }
        else

            window.location = "app.html";
          

       /* else 
          pushNotification.register(
                    tokenHandler,
                    errorHandler,
                    {
                        "badge":"true",
                        "sound":"true",
                        "alert":"true",
                        "ecb":"window.onNotificationAPN"
                    });
        */


          })
          .error(function(err){
            console.log(err)
              $scope.error_login = map_error[err.error.toLowerCase()];
              $rootScope.loading = false;     

          })

    }

    $scope.logout = function(){


       var confirm = $mdDialog.confirm()
                     .title('Confirmación')
                     .content('Esta seguro de cerrar la sesión?')
                     .ariaLabel('alerta')
                     .ok('Si')
                     .cancel('No');


      $mdDialog.show(confirm)
        .then(function(){
         
          $storage.delete('config');
         $storage.delete('token');
   
    if(window.cordova)
         pushNotification.unregister(function(rs){ console.log('Registrado del dispositivo eliminado'); }, function(rs){ console.log(rs); });

         window.location.reload();

        }, function(){
           
        })
      ;

        
    }


  $rootScope.stats = function(){

  
     $API
     .visit()
     .add('/summary/'+$storage.get('config').buildingId)
     .get()
     .success(function(rs){


        $rootScope.vstats = {
            approved : rs.Apporveds,
            pending : rs.Pendings,
            rejected : rs.Rejecteds,
            preauthorized : rs.Preauthorizeds,
            all : (rs.Apporveds + rs.Pendings + rs.Rejecteds + rs.Preauthorizeds)
        };

         
      });

     $API
     .correspondenceStats($storage.get('config').buildingId)
     .get()
     .success(function(rs){
         $rootScope.cstats = rs;
         console.log(rs, 'correspondence')
     })



  }

  $scope.userinfo = function(){

    if(!$rootScope.user)
      $API
       .user()
       .get()
       .success(function(rs){
           $rootScope.user = rs;
           $rootScope.username = rs.FirstName + ' ' + rs.LastName;
       });
     }

     var configg = window.config[window.config.env];
     $rootScope.apiurl  = configg.apiUrlBase + configg.apiBaseUri;
     delete configg;


  setTimeout(function(){

  if(window.localStorage.token)
     $scope.stats();
     $scope.userinfo();
     $rootScope.building = 1;

  }, 2000)

  


}


function logedCtrl($rootScope, $storage, $API){

     


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

      delete $rootScope.selected;
  }

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




 


  $scope.suiteBottomSheet = function() { 

   if($scope.selected)
      {
        this.value.checked = !this.value.checked;

        if(this.value.checked)
        $scope.selected.push(this.value);
        else
        $scope.selected.splice($scope.selected.indexOf(this.value),1);


        return;
      }
   
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

        
        if($rootScope.thebuilding.Towers.length > 1)
            window.location = "#/home/towers";
        else
            window.location = "#/home/suites";

  }


   $scope.load = function(callback){

    if(!$rootScope.thebuilding)
       $API
       .building($scope.building)       
       .get()       
       .success(function(rs){

           console.log(rs, 'javier');

           $rootScope.thebuilding = rs;


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
    

       if(!$rootScope.thebuilding)
         $scope.load(function(rs){
            if(rs)
             $scope.values = $rootScope.thebuilding.Towers;              
         })
       else
          $scope.values = $rootScope.thebuilding.Towers;


   }

   $scope.getFloors = function(){
      
      if(!$rootScope.thebuilding)
         $scope.load(function(rs){
            if(rs)
              $scope.values = $rootScope.thebuilding.floors;              
         })
      else
          $scope.values = $rootScope.thebuilding.floors;

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

        

          var tower = containsTower($state.params.id, $rootScope.thebuilding.Towers);

          console.log(tower, 'id');



          for(x in tower.Floors) 
            for(j in tower.Floors[x].Suites)
           if(typeof tower.Floors[x].Suites[j] === 'object' )
              $scope.values.push({tower:{Name : tower.Name, Id: tower.Id}, suite:tower.Floors[x].Suites[j]});   
            
            
            $rootScope.pageTitle =   tower.Name;


            console.log($scope.values);



          return;
        }

        for(var x in $rootScope.thebuilding.Towers)
              for(var j in $rootScope.thebuilding.Towers[x].Floors)                 
                  for(var n in $rootScope.thebuilding.Towers[x].Floors[j].Suites)
                   $scope.values.push({tower: {Name : $rootScope.thebuilding.Towers[x].Name, Id: $rootScope.thebuilding.Towers[x].Id}, suite : $rootScope.thebuilding.Towers[x].Floors[j].Suites[n]});  
                    

                 
            console.log($scope.values, $scope.suites)

      }

      if(!$rootScope.thebuilding)
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
                 $rootScope.stats();


  
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


   $scope.load = function(state){

  
    var params = params || {};

        if(params.favorites)
          {

            $scope.values = $storage.get('favorites') || [];
            return;
          }

        $API
       .visit()
       .add("/Building/"+ $storage.get('config').buildingId + (state ? "/" + state : '') + "?page=1")
       .get()
       .success(function(rs){
           console.log(rs, 'VISITASSSSSS');
           $scope.values = rs;
       });

   }


    $scope.loadMore = function(page, state){
    
      if(!$scope.stop)
      $API
      .visit()
      .add("/Building/"+ $storage.get('config').buildingId + "/" + state + "?page=" + page )
      .get()
      .success(function(rs){

        console.log(rs, "MOREEEEEEE")

        if(rs.length < 20)
          $scope.stop = true;


        $scope.values = $scope.values.concat(rs);   


        console.log($scope.values);     


      });
    }

    $scope.page = 1;

    
    $scope.more = function(state){


      if($rootScope.loading)
        return;

        $scope.page++;
        $scope.loadMore($scope.page, state);
    }


   $scope.add = function(){

     var data = new FormData();

      if($rootScope.photosrc)
         data.append('file', dataURLToBlob($rootScope.photosrc))

      $API
      .file($storage.get('config').buildingId)
      .post(data, { headers : {'Content-Type' : undefined} })
      .success(function(rs){
           
           console.log(rs, 'file')

           $scope.form.CustomData = $scope.form.CustomData || {};
           $scope.form.CustomData.tower = $rootScope.suite.tower.Name;
           $scope.form.CustomData.suite = $rootScope.suite.suite.Name;
           $scope.form.CustomData.image = rs[0];
           $scope.form.ImageName = rs[0];


            $API
            .post_visit($rootScope.suite.suite.Id)
            .post($scope.form)
            .success(function(rs){
       

               console.log(rs, 'visit');

              
               $rootScope
               .alerta('Visita', 'Visita registrada y notificada')
               .then(function(){

                 delete $scope.form;
                 delete $rootScope.selected;
                 delete $rootScope.photosrc;

                 $rootScope.stats();
                 $rootScope.gohome();
           
               });

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


function correspondenceCtrl($scope, $rootScope, $API, $storage, $mdBottomSheet, $state, $stateParams){

  console.log($state, 'state');

  $scope.suite = $state.params.id || null;
  $scope.page = 1;
  $scope.values = [];

  delete $rootScope.photo;
  $mdBottomSheet.hide();

  $scope.centerBottomSheet = function(val) {

    if($scope.selected)
      {
        this.value.checked = !this.value.checked;

        if(this.value.checked)
        $scope.selected.push(this.value);
        else
        $scope.selected.splice($scope.selected.indexOf(this.value),1);


        return;
      }
    
    $rootScope.correspondence = val;

    $mdBottomSheet.show({
      templateUrl: 'views/bottom_sheet/correspondence.html',
      preserveScope : true
    })
    .then(function(){ 
       $mdBottomSheet.hide();
    }, function(){
       $mdBottomSheet.hide();
    })
    ;

  };

 $scope.nodelivered = function(item){
   console.log(item, 'item')
    return !/\w\s?/g.test(item.DeliveredTo);
 }

 $scope.delivered = function(item){
   console.log(item, 'item')
    return /\w\s?/g.test(item.DeliveredTo);
 }


 

 $rootScope.deliver = function(){

  console.log($rootScope.selected, 'selecteds');

  $rootScope.loading = true;

  if(!$rootScope.selected)
     for(x in $rootScope.correspondence.SuitesId)
        $API
        .deliver()
        .post({
          To : 'Any',
          SuiteId : $rootScope.correspondence.SuitesId[x],
          CorrespondencesIds : [$rootScope.correspondence.Id]
        })
        .success(function(){
            $mdBottomSheet.hide();
            $rootScope.cstats.Pendings--;
            $rootScope.cstats.elivereds++;


        })
    else
     for(j in $rootScope.selected){
      for(x in $rootScope.selected[j].SuitesId)
        $API
        .deliver()
        .post({
          To : 'Any',
          SuiteId : $rootScope.selected[j].SuitesId[x],
          CorrespondencesIds : [$rootScope.selected[j].Id]
        })
        .success(function(){
            $mdBottomSheet.hide();
            $rootScope.cstats.Pendings--;
            $rootScope.cstats.elivereds++;

        })


       $scope.values.splice($scope.values.indexOf($rootScope.selected[j]),1);


      }


       
       $rootScope.alerta('Mensaje', 'Correspondencia(s) Entregada(s)')
            .then(function(){
              // $rootScope.gohome();
              delete $rootScope.selected;

            });
      


 }

  $scope.takeimage = function(){
     document.getElementById('correspondence').click()
   }

    $scope.load = function(page){
      $API
      .correspondencesall($storage.get('config').buildingId, page || 1)
      .get()
      .success(function(correspondences){

        $scope.values = correspondences || [];        


      });
    }

     $scope.loadMore = function(page){
    
      if(!$scope.stop)
      $API
      .correspondencesall($storage.get('config').buildingId, page || 1)
      .get()
      .success(function(rs){

        console.log(rs)

        if(rs.length < 20)
          $scope.stop = true;


        $scope.values = $scope.values.concat(rs);   


        console.log($scope.values);     


      });
    }


    $scope.loadSuite = function(page){


      $API
      .correspondencee()
      .add('?SuiteId='+$stateParams.id)
      .get()
      .success(function(correspondences){

        $scope.values = correspondences || [];        


      });

    }


    $scope.more = function(where){

      if($rootScope.loading)
        return;

        $scope.page++;

        if(!where)
        $scope.loadMore($scope.page);
        else
        $scope.loadMoreSuite($scope.page);

    }

    $scope.loadOne = function(){

  
      $API
      .correspondencee($stateParams.id)
      .get()
      .success(function(rs){
        console.log(rs);
        $scope.value = rs || [];
      });
    }


    $scope.loadOneOpen = function(){
  
      $API
      .openrequests($stateParams.id)
      .get()
      .success(function(rs){
        console.log(rs, 'OPEEEEEEEEN');
        $scope.value = rs || [];
      });

    }


    $scope.replyOpen = function(){


      if(!$rootScope.photosrc)
          $rootScope
               .alerta('Correspondencia', 'Debes agregar una foto de la correspondencia')
               .then(function(){})
       

      var data = new FormData();

      if($rootScope.photosrc)
      data.append('file', dataURLToBlob($rootScope.photosrc));

      $API
      .file($storage.get('config').buildingId)
      .post(data, { headers : {'Content-Type' : undefined} })
      .success(function(rs){

       $API
      .openrequests($stateParams.id)
      .add('/AsociateImage/' + rs[0])
      .post()
      .success(function(rs){
        console.log(rs, 'OPEEEEEEEEN');
        $scope.value = rs || [];
            
              $rootScope
               .alerta('Correspondencia', 'Solicitud Respondida')
               .then(function(){})

               window.location = "#/correspondencias/aperturas";

        });

      });


    }


     $scope.loadOpenRequests = function(){
    
      $API
      .openrequest($storage.get('config').buildingId)
      .get()
      .success(function(rs){
        console.log(rs, 'opens')
        $scope.values = rs || [];
      });
    }


    $scope.gotoopen = function(){

        window.location = "#/apertura/"+ this.value.Id;

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

      delete $rootScope.selected;
  }




    $scope.add = function(){

        var to = $rootScope.toall ? [] : $rootScope.selected || [$rootScope.suite.suite.Id];

        if($rootScope.selected)
        if(!$rootScope.toall && $rootScope.selected.length > 0)
            {
              _to = [];

              for(x in to)
                _to.push(to[x].suite.Id);

              to = _to;
              delete _to;
              console.log(to,'array');
            }

        $scope.form.SuitesId = to;


      var data = new FormData();

      if($rootScope.photosrc)
      data.append('file', dataURLToBlob($rootScope.photosrc))

      $API
      .file($storage.get('config').buildingId)
      .post(data, { headers : {'Content-Type' : undefined} })
      .success(function(rs){

    
        $scope.form.CustomData = $scope.form.CustomData || {};

        $scope.form.CustomData.image = rs[0];
        $scope.form.Image = rs[0];

        if(!$rootScope.selected){
        $scope.form.CustomData.suite = $rootScope.suite.suite.Name;
        $scope.form.CustomData.tower = $rootScope.suite.tower.Name;
        }

        $scope.form.CustomData.SuitesId = to;
    
         

        $API
        .correspondence($storage.get('config').buildingId)
        .post($scope.form)
        .success(function(rs, code){


              if(code === 500)
                $rootScope
               .alerta('Correspondencia', 'No se pudo registrar la correspondencia')
               .then(function(){
                
                $rootScope.gohome();
           
               });
  
              
               console.log(rs, 'correspondence')
              
               delete $scope.form;
               delete $rootScope.selected;
               delete $rootScope.photosrc;

               $rootScope
               .alerta('Correspondencia', 'Correspondencia registrada y notificada')
               .then(function(){
                
                $rootScope.gohome();
           
               });
  

          })
        })

     


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

