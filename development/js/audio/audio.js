app

	.factory("SoundNotification", function($log, $filter){

		soundNotification = {
			sounds: [
				{ name: "Morse: \"SOTA\"", file: "SOTA.mp3" },
				//{ name: "Ding", file: "Ding.wav" },
				{ name: "Horn", file: "Horn.mp3" },
				//{ name: "Tumtumdim", file: "Tumtumdim.mp3" },
			],
			spotsMute: false,
		};

		//Test if HTML5 localStorage is supported
		try {
        	localStorage.setItem("test", "test");
        	localStorage.removeItem("test");
        	soundNotification.localStorageIsSupported = true;
	    } catch(e) {
	        soundNotification.localStorageIsSupported = false;
	    }

		if(soundNotification.localStorageIsSupported){
			soundNotification.selectedSoundSpots = soundNotification.sounds[soundNotification.sounds.map(function(x) {return x.name; }).indexOf(localStorage.getItem("selectedSoundSpots"))];
			soundNotification.spotsMute = (localStorage.getItem("spotsMute") === "true")? true : false;
			$log.debug(localStorage.getItem("spotsMute"));
			$log.debug(soundNotification.spotsMute);
		}

		soundNotification.selectedSoundSpots = soundNotification.selectedSoundSpots || soundNotification.sounds[0];

		// The file to play is now set, we can initialize the Audio

		soundNotification.audioSpots = new Audio("src/sound/"+soundNotification.selectedSoundSpots.file);

		soundNotification.save = function(){
			localStorage.setItem("selectedSoundSpots", soundNotification.selectedSoundSpots.name);
			localStorage.setItem("spotsMute", soundNotification.spotsMute);
			soundNotification.audioSpots = new Audio("src/sound/"+soundNotification.selectedSoundSpots.file);
			$log.debug("SoundNotification save:");
			$log.debug(soundNotification.selectedSoundSpots);
			$log.debug(soundNotification.spotsMute);
		};

		soundNotification.playSpots = function(spots){

			$log.debug("PlaySpots:");
			if(!soundNotification.spotsMute){
				$log.debug("Notifications not muted");

				spotlist = $filter('matchSpots')(spots);
				
				for(var index in spotlist){
					if(spotlist[index].isNew){
						if(spotlist[index].match){
							soundNotification.audioSpots.play();
						}
					}
					else{
						break;
					}
				}
			}
		};

		soundNotification.testSpots = function(){
			soundNotification.audioSpots.currentTime = 0;
			soundNotification.audioSpots.play();
		};

		return soundNotification;
	});