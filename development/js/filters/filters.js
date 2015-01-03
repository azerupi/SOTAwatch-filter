var bandFrequencyRange = {
					// Band: [begin frequency, end frequency]
					160: [1.8, 2.0],
					80: [3.5, 4.0],
					60: [5.3, 5.41],
					40: [7.0, 7.3],
					30: [10.1, 10.15],
					20: [14, 14.35],
					17: [18.068, 18.168],
					15: [21, 21.45],
					12: [24.89, 24.99],
					10: [28, 29.7],
					6: [50, 54],
					4: [70.25, 70.5],
					2: [144, 148],
					70: [420, 450],
					23: [1240, 1300],
					13: [2300, 2450],
};

// Helper function
function inBand(frequency, band){
	

	if(typeof(band) !== 'undefined'){
		return (frequency >= bandFrequencyRange[band][0] && frequency <= bandFrequencyRange[band][1])? true : false;
	}

	for(var index in bandFrequencyRange){
		if(frequency >= bandFrequencyRange[index][0] && frequency <= bandFrequencyRange[index][1]){
			return true;
		}
	}

	return false;
}

function giveBand(frequency){
	console.log(frequency);
	for(var key in bandFrequencyRange){
		console.log(key);
		if(frequency > bandFrequencyRange[key][0] && frequency < bandFrequencyRange[key][1]){
			return parseInt(bandFrequencyRange[key][0]);
		}
	}
	return "undefined";
	
}

app.
	// Filter to convert a date object to UTC time as string in this format: HH:MM:SS UTC
	filter('dateToUTCTime', function(){
		return function(date){
			if(date instanceof Date){
				var hours = (date.getUTCHours() < 10)? "0"+date.getUTCHours() : ""+date.getUTCHours();
				var minutes = (date.getUTCMinutes() < 10)? "0"+date.getUTCMinutes() : ""+date.getUTCMinutes();
				var seconds = (date.getUTCSeconds() < 10)? "0"+date.getUTCSeconds() : ""+date.getUTCSeconds();
				return hours + ":" + minutes + ":" + seconds + " UTC";
			}
			else if(date){
				return "Given parameter is not a JavaScript Date object";
			}

			return "";
		};
	})

	// Rudimentary pluralizing filter, use it like this in templates: {{ ordinal | pluralize:'noun':'showNumber' (optional) }}
	.filter('pluralize', function() {
        return function(ordinal, noun, showNumber) {

        	// Give default value to showNumber
        	if(typeof(showNumber)==='undefined') showNumber = true;

            if (ordinal == 1) {
                return ((showNumber)? ordinal + ' ' : '') + noun;        
            } else {
                var plural = noun;
                if (noun.substr(noun.length - 2) == 'us') {
                    plural = plural.substr(0, plural.length - 2) + 'i';   
                } else if (noun.substr(noun.length - 2) == 'ch' || noun.charAt(noun.length - 1) == 'x' || noun.charAt(noun.length - 1) == 's') {
                    plural += 'es';
                } else if (noun.charAt(noun.length - 1) == 'y' && ['a','e','i','o','u'].indexOf(noun.charAt(noun.length - 2)) == -1) {
                    plural = plural.substr(0, plural.length - 1) + 'ies';   
                } else if (noun.substr(noun.length - 2) == 'is') {
                    plural = plural.substr(0, plural.length - 2) + 'es';        
                } else {
                    plural += 's';   
                }
                return ((showNumber)? ordinal + ' ' : '') + plural;   
            }
        };
  	})



	.filter("nPlus", function(){
		return function(number, max){
			if(typeof(max)==='undefined') max = 5;

			if(number > max){ return max+"+"; }

			return number;
		};
	})



	.filter('filterSpots', function($log, settingsService, SoundNotification, SpotsService, loggerService){

		return function(spots){

			


			filterSettings = settingsService;
			objectSpots = SpotsService;
			soundNotification = SoundNotification;

			logger = loggerService;

			
			$log.debug("Entered filter: filterSpots");

			if(true){ // filter not disabled

				
				
				for(var index in spots){
										
					// 				CALLSIGN
					//
					// If callsign doesn't match the include
					if(!spots[index].callsign.match(new RegExp(filterSettings.callsign.include, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!spots[index].callsign.match(new RegExp(filterSettings.callsign.include, "i"))'); }
					// If callsign does match the exclude
					else if(filterSettings.callsign.exclude !== "" && spots[index].callsign.match(new RegExp(filterSettings.callsign.exclude, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'filterSettings.callsign.exclude !== "" && spots[index].callsign.match(new RegExp(filterSettings.callsign.exclude, "i"))'); }

					// 				SUMMIT
					//
					// If summit doesn't match the include
					else if(!spots[index].summitReference.match(new RegExp(filterSettings.summit.include, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!spots[index].summitReference.match(new RegExp(filterSettings.summit.include, "i"))'); }
					// If summit does match the exclude
					else if(filterSettings.summit.exclude !== "" && spots[index].summitReference.match(new RegExp(filterSettings.summit.exclude, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'filterSettings.summit.exclude !== "" && spots[index].summitReference.match(new RegExp(filterSettings.summit.exclude, "i"))'); }

					// 				COMMENT
					//
					// If comment doesn't match the include
					else if(!(spots[index].comment + spots[index].postedBy).match(new RegExp(filterSettings.comment.include, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!(spots[index].comment + spots[index].postedBy).match(new RegExp(filterSettings.comment.include, "i"))'); }
					// If comment does match the exclude
					else if(filterSettings.comment.exclude !== "" && (spots[index].comment + spots[index].postedBy).match(new RegExp(filterSettings.comment.exclude, "i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'filterSettings.comment.exclude !== "" && (spots[index].comment + spots[index].postedBy).match(new RegExp(filterSettings.comment.exclude, "i"))'); }
					
					// 				BAND
					//
					else if(!filterSettings.band[160]  && inBand(spots[index].frequency, 160) ){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[160]  && inBand(spots[index].frequency, 160) '); }
					else if(!filterSettings.band[80]  && inBand(spots[index].frequency, 80)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[80]  && inBand(spots[index].frequency, 80)'); }
					else if(!filterSettings.band[60]  && inBand(spots[index].frequency, 60)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[60]  && inBand(spots[index].frequency, 60)'); }
					else if(!filterSettings.band[40]  && inBand(spots[index].frequency, 40)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[40]  && inBand(spots[index].frequency, 40)'); }
					else if(!filterSettings.band[30]  && inBand(spots[index].frequency, 30)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[30]  && inBand(spots[index].frequency, 30)'); }
					else if(!filterSettings.band[20]  && inBand(spots[index].frequency, 20)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[20]  && inBand(spots[index].frequency, 20)'); }
					else if(!filterSettings.band[17]  && inBand(spots[index].frequency, 17)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[17]  && inBand(spots[index].frequency, 17)'); }
					else if(!filterSettings.band[15]  && inBand(spots[index].frequency, 15)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[15]  && inBand(spots[index].frequency, 15)'); }
					else if(!filterSettings.band[12]  && inBand(spots[index].frequency, 12)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[12]  && inBand(spots[index].frequency, 12)'); }
					else if(!filterSettings.band[10]  && inBand(spots[index].frequency, 10)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[10]  && inBand(spots[index].frequency, 10)'); }
					else if(!filterSettings.band[6]  && inBand(spots[index].frequency, 6)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[6]  && inBand(spots[index].frequency, 6)'); }
					else if(!filterSettings.band[4]  && inBand(spots[index].frequency, 4)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[4]  && inBand(spots[index].frequency, 4)'); }
					else if(!filterSettings.band[2]  && inBand(spots[index].frequency, 2)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[2]  && inBand(spots[index].frequency, 2)'); }
					else if(!filterSettings.band[70]  && inBand(spots[index].frequency, 70)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[70]  && inBand(spots[index].frequency, 70)'); }
					else if(!filterSettings.band[23]  && inBand(spots[index].frequency, 23)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[23]  && inBand(spots[index].frequency, 23)'); }
					else if(!filterSettings.band[13]  && inBand(spots[index].frequency, 13)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band[13]  && inBand(spots[index].frequency, 13)'); }
					// others
					else if(!filterSettings.band.others && !inBand(spots[index].frequency)){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.band.others && !inBand(spots[index].frequency)'); }
					
					// 				MODE
					//
					else if(!filterSettings.mode.cw && spots[index].mode.match(new RegExp("cw","i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.mode.cw && spots[index].mode.match(new RegExp("cw","i"))'); }
					else if(!filterSettings.mode.ssb && spots[index].mode.match(new RegExp("ssb","i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.mode.ssb && spots[index].mode.match(new RegExp("ssb","i"))'); }
					else if(!filterSettings.mode.fm && spots[index].mode.match(new RegExp("fm","i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.mode.fm && spots[index].mode.match(new RegExp("fm","i"))'); }
					else if(!filterSettings.mode.others && !spots[index].mode.match(new RegExp("cw|ssb|fm","i"))){ spots[index].match = false; $log.debug("Spot does not match: "+'!filterSettings.mode.others && !spots[index].mode.match(new RegExp("cw|ssb|fm","i"))'); }

					// 				POINTS
					//
					else if(spots[index].points <= filterSettings.points){ spots[index].match = false; $log.debug("Spot does not match: "+'spots[index].points <= filterSettings.points'); }
					
					//				PRESENT IN LOG
					//
					else if(logger.isInLog(spots[index].callsign, spots[index].summitReference) && filterSettings.hideLog){ spots[index].match = false; $log.debug("Spot does not match: "+'spots[index] appears in the log');}

					// IN ALL OTHER CASES THE SPOT DOES MATCH
					else{
						spots[index].match = true;
					}






					//
					//		APPLY THE VALUES TO THE PROPERTIES DEPENDING ON THE SETTINGS
					//

					// Set default values and change them if the spot matches

					spots[index].hide = false;
					spots[index].highlightMatch = false;
					spots[index].highlightReject = false;

					if(!spots[index].match){

						// Here apply what the filter has to apply (remove from array or add a property that will be used for highlighting, ...)
						if(filterSettings.hideMatched){ spots[index].hide = true; }
						else if(filterSettings.highlightRejected){ spots[index].highlightReject = true; }

					}
					else{
						if(!filterSettings.hideMatched && filterSettings.highlightMatched){ spots[index].highlightMatch = true; }
					}
					
				}
				//*/

			}

			$log.debug(spots);

			return spots;
		};

	});