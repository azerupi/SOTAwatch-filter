app


    .directive("checkEmpty", function(){
        return {
            link: function(scope, element, attrs){

                element.on("blur", function(){
                    if(element.val() === ""){
                        element.val(attrs.checkEmpty);
                    }
                });

            },
        };
    })


        .directive("checkInRange", function($log, $parse){
        return {
            require: "ngModel",
            scope: {
                save: '&save',
            },
            link: function(scope, element, attrs, model){

                var min = parseInt(attrs.mdMin,10);
                var max = parseInt(attrs.mdMax, 10);

                scope.$watch(function () {
                        return model.$modelValue;
                    }, 

                    function(){
                        $log.debug(model.$modelValue);
                        if(model.$modelValue > max){

                            model.$setViewValue(max);
                            model.$render();
                            //scope.$apply();
                        }

                        if(model.$modelValue < min){

                            model.$setViewValue(min);
                            model.$render();
                            //scope.$apply();
                        }

                        if(scope.save){
                            scope.save();
                        }

                    }
                );

            },
        };
    });