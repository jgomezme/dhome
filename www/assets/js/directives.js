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
            
            $scope.takeimage = function(){                

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

                 navigator.camera.getPicture(success, error);       

              } 
         },
         templateUrl : 'views/components/photo.html'         
    }
}

angular.module('dhome')
.directive('fileModel', fileModel)
.directive('mdPhotoCapture', photo)
;