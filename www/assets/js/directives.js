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
         scope : {
            label : '@',
            required : '@'
         },
         link : function(scope, element, attrs){ 
              scope.takeimage = function(){
                document.getElementById('iphoto').click()
              }                                    
         },
         templateUrl : 'views/components/photo.html'         
    }
}

angular.module('dhome')
.directive('fileModel', fileModel)
.directive('mdPhotoCapture', photo)
;