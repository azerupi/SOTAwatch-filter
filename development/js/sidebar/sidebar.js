app



    .controller("sidebarController", function($scope, $location, $routeParams, $log, SpotsService){
        $scope.spots = SpotsService;

        $scope.$on("$routeChangeSuccess", function($currentRoute) {
            $scope.currentView = $location.path();
            $log.debug($scope.currentView);

            if($scope.currentView === "/spotfilter" || $scope.currentView === "/"){
                $scope.spots.resetNumberOfNewSpots();
            }
        });

        $scope.$watch("spots.numberOfNewSpots", function(){
            if($scope.currentView === "/spotfilter" || $scope.currentView === "/"){
                $scope.spots.resetNumberOfNewSpots();
            }
        });

    })



    .filter("numberOfBadges", function($log, settingsService, SoundNotification, SpotsService){

        return function(spots){


            filterSettings = settingsService;
            objectSpots = SpotsService;


            if(objectSpots.newSpots){ 

                spots = $filter('matchSpots')(spots);

                for(var index in spots){
                                        
                    
                    //
                    //      APPLY THE VALUES TO THE PROPERTIES DEPENDING ON THE SETTINGS
                    //

                    if(spots[index].match && spots[index].isNew){

                        objectSpots.numberOfNewSpots++;
                        // Play sound
                        $log.debug("playSound property is");
                        $log.debug(objectSpots.playSound);
                        if(objectSpots.playSound && spots[index].isNew){
                            $log.debug("Play Sound !");
                            soundNotification.playSpots();
                            objectSpots.playSound = false;
                        }
                    }
                    
                }
                //*/

                objectSpots.newSpots = false;

            }

            

            return objectSpots.numberOfNewSpots;
        };

    });