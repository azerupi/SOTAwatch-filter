app

    .controller("loggerController", function($scope, $filter, loggerService){
       
        $scope.log = loggerService;
        $scope.Date = Date;
        $scope.form = {logDate:"", logTime:"", logCallsign:"", logSummit:"", logBand:"", logMode:"", logEditMode: false};
        
    })

    .factory('loggerService', function($log,$filter, $window){
        
        var log = {};

        //Test if HTML5 localStorage is supported
        try {
            localStorage.setItem("test", "test");
            localStorage.removeItem("test");
            log.localStorageIsSupported = true;
        } catch(e) {
            log.localStorageIsSupported = false;
        }

        // If supported try to load the saved settings
        if(log.localStorageIsSupported){
            log.myCallsign = localStorage.getItem("log-mycallsign")? localStorage.getItem("log-mycallsign") : "";
            log.mySummit = localStorage.getItem("log-mysummit")? localStorage.getItem("log-mysummit") : "";

            log.loglist = [];

            (function(){
                var storageString = localStorage.getItem("log-array");

                if(!!storageString){
                    
                    $log.debug("Importing log");
                    var splitted = storageString.split("\n");

                    for(var i in splitted){
                        $log.debug(i+" entry");
                        var elements = splitted[i].split(";");

                        log.loglist.push({callsign: elements[0], summit: elements[1], band: elements[2], mode: elements[3],
                                    date: elements[4], time: elements[5]});
                    }
                }

            })();            
        }

        // Else default settings:

        if(typeof(log.myCallsign) === 'undefined') log.myCallsign = "";
        if(typeof(log.mySummit) === 'undefined') log.mySummit = "";
        if(typeof(log.loglist) === 'undefined') log.loglist = [];

        
        log.save = function(){
            
            if(log.localStorageIsSupported){
                
                if(log.myCallsign) localStorage.setItem("log-mycallsign", log.myCallsign);
                if(log.mySummit) localStorage.setItem("log-mysummit", log.mySummit);

                var storageString = "";

                for(var index in log.loglist){
                    storageString += log.loglist[index].callsign+";"+
                                        log.loglist[index].summit+";"+
                                        log.loglist[index].band+";"+
                                        log.loglist[index].mode+";"+
                                        log.loglist[index].date+";"+
                                        log.loglist[index].time+"\n";
                }


                localStorage.setItem("log-array", storageString.slice(0,-1));

                $log.debug("Log saved");

            }

        };


        log.add = function(callsign, summit, band, mode, date, time){

            
            // Verify
            if(typeof(date)==='undefined'){
                date = $filter('date')(new Date(), "dd/MM/yy", "UTC");
            }

            if(typeof(time)==='undefined'){
                time = $filter('date')(new Date(), "HH:mm", "UTC");
            }

            //remove special characters
            callsign = callsign.replace(/[^\w\d\/\-]/gi, '');
            summit = summit.replace(/[^\w\d\/\-\?]/gi, '');
            band = band.replace(/[^\.\d]/gi, '');
            mode = mode.replace(/[^\w]/gi, '');
            date = date.replace(/[^\d\/]/gi, '');
            time = time.replace(/[^:\d]/gi, '');
            
            // Verify for doubles

            // Add to array
            log.loglist.push({date: date, callsign: callsign, summit: summit, time: time, band: band, mode: mode});

            log.sort();

            log.save();

            // Google analytics Event
            $window.ga('send', 'event', 'logger', 'add', "Added a new spot to the log");
        };

        log.remove = function(callsign, summit, band, mode){
            
            for( var index in log.loglist){
                if(log.loglist[index].callsign === callsign && log.loglist[index].summit === summit && log.loglist[index].band == band && log.loglist[index].mode === mode){
                    log.loglist.splice(index,1);
                    log.save();
                    return;
                }
            }

        };

        log.sort = function(){
            log.loglist.sort(function(a,b){

                // Compare function

                // Sort on date first
                a_date = a.date.split("/");
                b_date = b.date.split("/");

                if(a_date[2] < b_date[2]){return -1;}
                else if(a_date[2] > b_date[2]){return 1;}
                
                if(a_date[1] < b_date[1]){return -1;}
                else if(a_date[1] > b_date[1]){return 1;}

                if(a_date[0] < b_date[0]){return -1;}
                else if(a_date[0] > b_date[0]){return 1;}

                // Sort on time next
                a_time = a.time.split(":");
                b_time = b.time.split(":");

                if(a_time[0] < b_time[0]){return -1;}
                else if(a_time[0] > b_time[0]){return 1;}

                if(a_time[1] < b_time[1]){return -1;}
                else if(a_time[1] > b_time[1]){return 1;}

                return 0;

            });
        };

        log.clear = function(){
            log.loglist = [];
            log.save();
        };

        log.export = function(){

            var csvString = "";

            // Encoding rules: http://www.sotadata.org.uk/ChaserCSVInfo.htm
            for( var index in log.loglist){
                csvString +=    "V2,"+
                                (log.myCallsign? log.myCallsign : "")+","+
                                (log.mySummit? log.mySummit : "")+","+
                                log.loglist[index].date+","+
                                log.loglist[index].time.replace(":","")+","+
                                giveBand(parseFloat(log.loglist[index].band))+"MHz,"+
                                log.loglist[index].mode+","+
                                log.loglist[index].callsign+","+
                                log.loglist[index].summit+"\r\n";
            }

            var csv = new Blob([csvString], {type: "text/plain;charset=utf-8"});
            saveAs(csv, "SOTAwatchfilter-log-"+$filter('date')(new Date(), "yyyyMMdd", "UTC")+"-"+$filter('date')(new Date(), "HHmm", "UTC")+".csv");

            // Google analytics Event
            $window.ga('send', 'event', 'logger', 'download', "Log file was downloaded");

        };

        log.isInLog = function(callsign, summit){
            for(var i in log.loglist){
                if(log.stripP(log.loglist[i].callsign) == log.stripP(callsign) && log.loglist[i].summit == summit){return true;}
            }
            return false;
        };

        log.stripP = function(callsign){
            return callsign.replace(/\/P$/,'');
        };


        return log;
    });