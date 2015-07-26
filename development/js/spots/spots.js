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
		spots.firstLoad = true;

		alert = alertService;
		// FETCH THE SPOTS VIA THE PROXY THAT RETURNS A JSON

		spots.refresh = function(){

			var requestTimeout = $q.defer();
			var requestStartTime = new Date().getTime();
			try{
				// $http.get("SOTAspots2Json.json", { timeout: requestTimeout.promise }) /*
				$http.get("http://www.on6zq.be/cgi-bin/SOTAspots2Json.cgi", { timeout: requestTimeout.promise }) //*/
					.success(function(data){
						spots.oldSpots = spots.spots;
						spots.stringSpots = [];

						for (var index in spots.oldSpots) {
							spots.stringSpots.push(spots.oldSpots[index].toString());
						}

						spots.stringSpots.sort();

						spots.stringSpots.is = function binaryIndexOf(searchElement) {
							//$log.debug(this);
						    var minIndex = 0;
						    var maxIndex = this.length - 1;
						    var currentIndex;
						    var currentElement;

						    while (minIndex <= maxIndex) {
						        currentIndex = (minIndex + maxIndex) / 2 | 0;
						        currentElement = this[currentIndex];

						        if (currentElement < searchElement) {
						            minIndex = currentIndex + 1;
						        }
						        else if (currentElement > searchElement) {
						            maxIndex = currentIndex - 1;
						        }
						        else {
									if(maxIndex < 0 || minIndex < 0){
										$log.error("Index can be less than 0");
									}
						            return true;
						        }
						    }

							//$log.log(searchElement + " not found");
						    return false;
						};

						//$log.log("-------------------------------------------------------");
						spots.processSpots(data.aaData);
						spots.lastUpdate = new Date();

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

			this.spots = [];
			var id = 0;

			for(var index in data){

				this.spots.push({
					index: id,
					operator: data[index][0],
					summitName: data[index][1],
					altitude: data[index][2],
					points:  data[index][3] !== ''? parseInt(data[index][3], 10) : '',
					date: data[index][4],
					callsign: data[index][5],
					callsign_without_p: data[index][5].replace(/\/P$/,''),
					summitReference: data[index][6],
					frequency: parseFloat(data[index][7]),
					frequencyString: data[index][7],
					mode: data[index][8],
					comment: data[index][9],
					postedBy: data[index][10],
					isNew: false, // Default value to be able to compare the objects
					toString: function() {
						return this.summitReference + ";" + this.callsign_without_p + ";" + this.frequency;
					},
				});

				// increment id
				id++;

				if(this.oldSpots.length > 0){

					if(!this.stringSpots.is(this.spots[this.spots.length - 1].toString()))
					{
						this.spots[this.spots.length - 1].isNew = true;
						this.newSpots = true;
					}
					else{
						this.spots[this.spots.length - 1].isNew = false;
					}
				}
				else if(this.oldSpots.length === 0 && !this.firstLoad){
					this.spots[this.spots.length - 1].isNew = true;
				}

			}

			this.firstLoad = false;

			SoundNotification.playSpots(this.spots);
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
				else if(spots.spotHovered !== null && spots.spots[i].callsign_without_p === spots.spots[spots.spotHovered].callsign_without_p){
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
