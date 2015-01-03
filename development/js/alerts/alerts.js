app.
    
    factory("alertService", function($timeout, $log){

        var alert = {};

        alert.alerts = [];

        alert.id = 0;

        alert.addAlert = function(text,cssClass,timeout){
            alert.alerts.push({
                id: alert.id,
                message: text,
                cssClass: cssClass,
                timeout: timeout,
            });

            var id = alert.id;

            $log.debug("Add alert:");
            $log.debug(alert.alerts[alert.alerts.length-1]);
            
            $timeout(function(){ alert.removeAlert(id); }, timeout);

            alert.id++;
        };

        alert.removeAlert = function(id){
            $log.debug("Remove alert:");
            $log.debug(alert.alerts);
            for(var i in alert.alerts){
                if(alert.alerts[i].id === id){
                    alert.alerts.splice(i,1);
                    break;
                }
            }
        };

        return alert;

    });