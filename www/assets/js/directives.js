function fileModel ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    
                });
            });
        }
    };
}

function photo(){

    return {
         restrict : 'E',
         replace : true,
         scope : {
            label : '@',
            required : '@'
         },
         controller : function($scope, $rootScope){ 
            

            $scope.takeimage = function($event){

                $event.preventDefault();

                console.log($event, 'eveeeeeent')
               

                 function success(rs){
                     console.log(rs);
                     $rootScope.$apply(function(){
                     $rootScope.photo = rs;
                                                
                     })
                    // $rootScope.$broadcast('preview-photo', rs)

                 }  

                 function error(err){
                     console.log(err);
                 }


                 if(window.cordova)
                 navigator.camera.getPicture(success, error);  
                 else
                 document.getElementById('iphoto').click();  

                 return false;   

              } 
         },
         templateUrl : 'views/components/photo.html'         
    }
}


function search(){
    return {
          restrict : 'E',
          replace : true,
          link : function(scope){
              scope.$parent.search = scope.search;
          },
          template : '  <div layout="row" style="padding: 10px 10px; background: rgba(219, 219, 219, 0.16); border-bottom:1px solid #ccc;"> <input ng-model="search" placeholder="Buscar" style="padding:3px; border-radius:3px; border: 1px solid #ccc !important; pading:3px;" flex> &nbsp;<ng-md-icon icon="search" style="fill:gray"></ng-md-icon> </div>'
    }
}


function showme(){
    return {
          restrict : 'A',
          replace : true,
          link : function(scope, element, attrs){

              scope.src = attrs.src;
              
              scope.show = function(){
                alert(attrs.src)
              scope.src = attrs.src;

              }


              angular.element(element).click = scope.show;
               

          },
          template : '<div class="overlay" ng-if="preview"><img  alt="preview"></div>'
    }
}

angular.module('dhome')
.directive('fileModel', fileModel)
.directive('mdPhotoCapture', photo)
.directive('ngMdSearch', search)
.directive('onScrollBottom', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.on('scroll', function(){

          /* If reached bottom */
          if ( elem[0].scrollHeight == elem[0].scrollTop + elem[0].clientHeight ) {
            /* Do what is specified by onScrollBottom */
            scope.$apply(function(){
              scope.$eval(attrs.onScrollBottom);
            });
          }
        });
      }
    };
})
;
