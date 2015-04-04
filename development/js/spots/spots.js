app

	.controller("spotfilterController", function($scope, $window, SpotsService, loggerService, alertService, settingsService){
		
		$scope.spots = SpotsService;
		$scope.logger = loggerService;
		$scope.tooltipPosition = ($window.innerWidth > 1050)? "right": "top";
		$scope.alert = alertService;

		$scope.settings = settingsService;

		$scope.$watch('settings.hideMatched', function() {
    		$scope.settings.save();
		});

		angular.element($window).bind('resize', function() {
	    	$scope.tooltipPosition = ($window.innerWidth > 1050)? "right": "top";
	    	return $scope.$apply();
	    });

	})




	.factory('SpotsService', function($timeout, $http, $log, $q, $window, SoundNotification, alertService){

		var spots = {};

		spots.spots = [];

		spots.numberOfNewSpots = 0;
		spots.newSpots = false;

		alert = alertService;
		// FETCH THE SPOTS VIA THE PROXY THAT RETURNS A JSON

		spots.refresh = function(){
			
			var requestTimeout = $q.defer();
			var requestStartTime = new Date().getTime();
			try{
				// 
				$http.get("http://www.on6zq.be/cgi-bin/SOTAspots2Json.cgi", { timeout: requestTimeout.promise })
					.success(function(data){
						spots.oldSpots = spots.spots;
						spots.spots = spots.processSpots(data.aaData, spots.oldSpots);
						spots.lastUpdate = new Date();
						spots.playSound = true;

						// Google analytics Event
						$window.ga('send', 'event', 'fetch', 'spots');

						$timeout(spots.refresh, 20000 + Math.random() * 5000);
					})
					.error(function(resp, status, header, config){
						$log.error("Error in the AJAX call to the server, status code: "+ status);

						// Handle timout
						var respTime = new Date().getTime() - requestStartTime;
				        if(respTime >= config.timeout){
				            //time out handeling
				            alert.addAlert("SOTAwatch filter could not reach the server, trying again in a few seconds", "warning", 8000);
				        } 
				        else{
				            //other error hanndling
				            $log.error("Not a timeout error: ");
				        }
						
						$timeout(spots.refresh, 10000 + Math.random() * 5000);
					});
				}
				catch(error){
					$log.error("An error occured: " + error.message);
				}

			$timeout(function() {
				requestTimeout.resolve(); // this aborts the request!
			}, 10000);
		};


		// PROCESS THE SPOTS TO SERVE THEM IN A USABLE ARRAY - OBJECT FORM

		spots.processSpots = function(data, oldSpots){

			var spotsProcessed = [],
				isNewSpot = true,
				id = 0;

			for(var index in data){
				spotsProcessed.push({
					index: id,
					operator: data[index][0],
					summitName: data[index][1],
					altitude: data[index][2],
					points:  data[index][3] !== ''? parseInt(data[index][3], 10) : '',
					date: data[index][4],
					callsign: data[index][5],
					summitReference: data[index][6],
					frequency: parseFloat(data[index][7]),
					frequencyString: data[index][7],
					mode: data[index][8],
					comment: data[index][9],
					postedBy: data[index][10],
					isNew: false, // Default value to be able to compare the objects
				});

				// increment id
				id++;

				//$log.debug("Compare last old vs new spots");
				//$log.debug(oldSpots[0]);
				//$log.debug(spotsProcessed[spotsProcessed.length - 1]);

				if(isNewSpot && oldSpots.length > 0){

					if( oldSpots[0].date !== spotsProcessed[spotsProcessed.length - 1].date  ||  oldSpots[0].callsign !== spotsProcessed[spotsProcessed.length - 1].callsign || oldSpots[0].frequency !== spotsProcessed[spotsProcessed.length - 1].frequency ){
						spotsProcessed[spotsProcessed.length - 1].isNew = true;
						spots.newSpots = true;
					}
					else{
						spotsProcessed[spotsProcessed.length - 1].isNew = false;
						isNewSpot = false;
					}
				}
				
			}

			SoundNotification.playSpots(spotsProcessed);

			return spotsProcessed;
		};


		spots.resetNumberOfNewSpots = function(){
			spots.numberOfNewSpots = 0;
		};


		spots.setHover = function(index){
			if(index !== "undefined" && index >= 0){
				for(var key in spots.spots){
					if(spots.spots[key].index === index){
						spots.spotHovered = key;
						break;
					}
				}
			}
			else{
				spots.spotHovered = null;
			}

			
			for (var i in spots.spots){
				if(i === spots.spotHovered){
					spots.spots[i].activeHover = true;
					spots.spots[i].passiveHover = false;
				}
				else if(spots.spotHovered !== null && spots.spots[i].callsign === spots.spots[spots.spotHovered].callsign){
					spots.spots[i].activeHover = false;
					spots.spots[i].passiveHover = true;
				}
				else{
					spots.spots[i].activeHover = false;
					spots.spots[i].passiveHover = false;
				}
			}
			
		};



		spots.refresh();

		return spots;
	});













