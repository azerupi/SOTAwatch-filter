app
	

	.controller("settingsController", function($scope, settingsService, SoundNotification, loggerService){
	
		$scope.spotfilter = settingsService;
		$scope.logger = loggerService;

		$scope.soundNotification = SoundNotification;

	})


	.controller("AudioSettingsController", function($scope, SoundNotification){

		$scope.soundNotification = SoundNotification;
		$scope.unmute = !$scope.soundNotification.spotsMute;

		$scope.$watch('soundNotification.spotsMute', function(value) {
			$scope.unmute = !value;
		});
		$scope.$watch('unmute', function(value) {
			$scope.soundNotification.spotsMute = !value;
			$scope.soundNotification.save();
		});

	})



	.factory('settingsService', function($log){

		var spotfilter = {
			callsign: {},
			summit: {},
			comment: {},
			band: {},
			mode: {},
		};

		//Test if HTML5 localStorage is supported
		try {
        	localStorage.setItem("test", "test");
        	localStorage.removeItem("test");
        	spotfilter.localStorageIsSupported = true;
	    } catch(e) {
	        spotfilter.localStorageIsSupported = false;
	    }

	    // If supported try to load the saved settings
		if(spotfilter.localStorageIsSupported){

			spotfilter.callsign.include = localStorage.getItem("callsignInclude");
			spotfilter.callsign.exclude = localStorage.getItem("callsignExclude");

			spotfilter.summit.include = localStorage.getItem("summitInclude");
			spotfilter.summit.exclude = localStorage.getItem("summitExclude");

			spotfilter.comment.include = localStorage.getItem("commentInclude");
			spotfilter.comment.exclude = localStorage.getItem("commentExclude");

			spotfilter.band[160] = (localStorage.getItem("band160") === "false")? false : true;
			spotfilter.band[80] = (localStorage.getItem("band80") === "false")? false : true;
			spotfilter.band[60] = (localStorage.getItem("band60") === "false")? false : true;
			spotfilter.band[40] = (localStorage.getItem("band40") === "false")? false : true;
			spotfilter.band[30] = (localStorage.getItem("band30") === "false")? false : true;
			spotfilter.band[20] = (localStorage.getItem("band20") === "false")? false : true;
			spotfilter.band[17] = (localStorage.getItem("band17") === "false")? false : true;
			spotfilter.band[15] = (localStorage.getItem("band15") === "false")? false : true;
			spotfilter.band[12] = (localStorage.getItem("band12") === "false")? false : true;
			spotfilter.band[10] = (localStorage.getItem("band10") === "false")? false : true;
			spotfilter.band[6] = (localStorage.getItem("band6") === "false")? false : true;
			spotfilter.band[4] = (localStorage.getItem("band4") === "false")? false : true;
			spotfilter.band[2] = (localStorage.getItem("band2") === "false")? false : true;
			spotfilter.band[70] = (localStorage.getItem("band70") === "false")? false : true;
			spotfilter.band[23] = (localStorage.getItem("band23") === "false")? false : true;
			spotfilter.band[13] = (localStorage.getItem("band13") === "false")? false : true;
			spotfilter.band.others = (localStorage.getItem("bandOthers") === "false")? false : true;

			spotfilter.mode.cw = (localStorage.getItem("modeCW") === "false")? false : true;
			spotfilter.mode.ssb = (localStorage.getItem("modeSSB") === "false")? false : true;
			spotfilter.mode.fm = (localStorage.getItem("modeFM") === "false")? false : true;
			spotfilter.mode.others = (localStorage.getItem("modeOthers") === "false")? false : true;

			spotfilter.points = parseInt(localStorage.getItem("points"), 10);

			spotfilter.hideMatched = (localStorage.getItem("hideMatched") === "false")? false : true;
			spotfilter.highlightRejected = (localStorage.getItem("highlightRejected") === "false")? false : true;
			spotfilter.highlightMatched = (localStorage.getItem("highlightMatched") === "true")? true : false;

			spotfilter.hideLog = (localStorage.getItem("hideLog") === "false")? false : true;

		}

		// If no value is set yet, put the default values

		spotfilter.callsign.include = spotfilter.callsign.include || ".*";
		spotfilter.callsign.exclude = spotfilter.callsign.exclude || "";

		spotfilter.summit.include = spotfilter.summit.include || ".*";
		spotfilter.summit.exclude = spotfilter.summit.exclude || "";

		spotfilter.comment.include = spotfilter.comment.include || ".*";
		spotfilter.comment.exclude = spotfilter.comment.exclude || "(test|ignore)";

		spotfilter.band[160] = (typeof spotfilter.band[160] !== "undefined")? spotfilter.band[160] : true;
		spotfilter.band[80] = (typeof spotfilter.band[80] !== "undefined")? spotfilter.band[80] : true;
		spotfilter.band[60] = (typeof spotfilter.band[60] !== "undefined")? spotfilter.band[60] : true;
		spotfilter.band[40] = (typeof spotfilter.band[40] !== "undefined")? spotfilter.band[40] : true;
		spotfilter.band[30] = (typeof spotfilter.band[30] !== "undefined")? spotfilter.band[30] : true;
		spotfilter.band[20] = (typeof spotfilter.band[20] !== "undefined")? spotfilter.band[20] : true;
		spotfilter.band[17] = (typeof spotfilter.band[17] !== "undefined")? spotfilter.band[17] : true;
		spotfilter.band[15] = (typeof spotfilter.band[15] !== "undefined")? spotfilter.band[15] : true;
		spotfilter.band[12] = (typeof spotfilter.band[12] !== "undefined")? spotfilter.band[12] : true;
		spotfilter.band[10] = (typeof spotfilter.band[10] !== "undefined")? spotfilter.band[10] : true;
		spotfilter.band[6] = (typeof spotfilter.band[6] !== "undefined")? spotfilter.band[6] : true;
		spotfilter.band[4] = (typeof spotfilter.band[4] !== "undefined")? spotfilter.band[4] : true;
		spotfilter.band[2] = (typeof spotfilter.band[2] !== "undefined")? spotfilter.band[2] : true;
		spotfilter.band[70] = (typeof spotfilter.band[70] !== "undefined")? spotfilter.band[70] : true;
		spotfilter.band[23] = (typeof spotfilter.band[23] !== "undefined")? spotfilter.band[23] : true;
		spotfilter.band[13] = (typeof spotfilter.band[13] !== "undefined")? spotfilter.band[13] : true;
		spotfilter.band.others = (typeof spotfilter.band.others !== "undefined")? spotfilter.band.others : true;

		spotfilter.mode.cw = (typeof spotfilter.mode.cw !== "undefined")? spotfilter.mode.cw : true;
		spotfilter.mode.ssb = (typeof spotfilter.mode.ssb !== "undefined")? spotfilter.mode.ssb : true;
		spotfilter.mode.fm = (typeof spotfilter.mode.fm !== "undefined")? spotfilter.mode.fm : true;
		spotfilter.mode.others = (typeof spotfilter.mode.others !== "undefined")? spotfilter.mode.others : true;

		spotfilter.points = spotfilter.points || 0;


		$log.debug("spotfilter settings are:");
		$log.debug(spotfilter);


		spotfilter.save = function(){
			if(spotfilter.localStorageIsSupported){

				$log.debug("Saving spotfilter settings:");
				$log.debug(spotfilter);

				localStorage.setItem("callsignInclude", spotfilter.callsign.include);
				localStorage.setItem("callsignExclude", spotfilter.callsign.exclude);

				localStorage.setItem("summitInclude", spotfilter.summit.include);
				localStorage.setItem("summitExclude", spotfilter.summit.exclude);

				localStorage.setItem("commentInclude", spotfilter.comment.include);
				localStorage.setItem("commentExclude", spotfilter.comment.exclude);

				localStorage.setItem("band160", spotfilter.band[160]);
				localStorage.setItem("band80", spotfilter.band[80]);
				localStorage.setItem("band60", spotfilter.band[60]);
				localStorage.setItem("band40", spotfilter.band[40]);
				localStorage.setItem("band30", spotfilter.band[30]);
				localStorage.setItem("band20", spotfilter.band[20]);
				localStorage.setItem("band17", spotfilter.band[17]);
				localStorage.setItem("band15", spotfilter.band[15]);
				localStorage.setItem("band12", spotfilter.band[12]);
				localStorage.setItem("band10", spotfilter.band[10]);
				localStorage.setItem("band6", spotfilter.band[6]);
				localStorage.setItem("band4", spotfilter.band[4]);
				localStorage.setItem("band2", spotfilter.band[2]);
				localStorage.setItem("band70", spotfilter.band[70]);
				localStorage.setItem("band23", spotfilter.band[23]);
				localStorage.setItem("band13", spotfilter.band[13]);
				localStorage.setItem("bandOthers", spotfilter.band.others);

				localStorage.setItem("modeCW", spotfilter.mode.cw);
				localStorage.setItem("modeSSB", spotfilter.mode.ssb);
				localStorage.setItem("modeFM", spotfilter.mode.fm);
				localStorage.setItem("modeOthers", spotfilter.mode.others);

				localStorage.setItem("points", spotfilter.points);

				localStorage.setItem("hideMatched", spotfilter.hideMatched);
				localStorage.setItem("highlightRejected", spotfilter.highlightRejected);
				localStorage.setItem("highlightMatched", spotfilter.highlightMatched);

				localStorage.setItem("hideLog", spotfilter.hideLog);
			}
		};

		spotfilter.reset = function(){
			spotfilter.callsign.include = ".*";
			spotfilter.callsign.exclude = "";

			spotfilter.summit.include = ".*";
			spotfilter.summit.exclude = "";

			spotfilter.comment.include = ".*";
			spotfilter.comment.exclude = "(test|ignore)";

			spotfilter.band[160] = true;
			spotfilter.band[80] = true;
			spotfilter.band[60] = true;
			spotfilter.band[40] = true;
			spotfilter.band[30] = true;
			spotfilter.band[20] = true;
			spotfilter.band[17] = true;
			spotfilter.band[15] = true;
			spotfilter.band[12] = true;
			spotfilter.band[10] = true;
			spotfilter.band[6] = true;
			spotfilter.band[4] = true;
			spotfilter.band[2] = true;
			spotfilter.band[70] = true;
			spotfilter.band[23] = true;
			spotfilter.band[13] = true;
			spotfilter.band.others = true;

			spotfilter.mode.cw = true;
			spotfilter.mode.ssb = true;
			spotfilter.mode.fm = true;
			spotfilter.mode.others = true;

			spotfilter.points = 0;

			spotfilter.save();

		};

		spotfilter.toggleBand = function(){
			var numberOfChecked = 0,
				length = 0;

			for(var key in spotfilter.band){
				$log.debug(spotfilter.band[key]);
				if(spotfilter.band[key] === true){
					numberOfChecked++;
				}
				length++;
			}

			for(key in spotfilter.band){
				if(numberOfChecked >= length/2){
					spotfilter.band[key] = false;
				}
				else{
					spotfilter.band[key] = true;
				}
			}

			spotfilter.save();
		};


		return spotfilter;
	});











