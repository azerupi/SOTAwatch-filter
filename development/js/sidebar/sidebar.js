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



    .filter("numberOfBadges", function($log, $filter, settingsService, SoundNotification, SpotsService){

        return function(spots){


            filterSettings = settingsService;
            objectSpots = SpotsService;


            if(objectSpots.newSpots){ 

                spots = $filter('matchSpots')(spots);

                for(var index in spots){

                    if(spots[index].isNew && spots[index].match){

                        objectSpots.numberOfNewSpots++;
                    }
                    
                }
                

                objectSpots.newSpots = false;

            }

            

            return objectSpots.numberOfNewSpots;
        };

    });