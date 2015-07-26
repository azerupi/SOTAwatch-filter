var app = angular.module("SOTAwatch filter", ['ngRoute', 'ui.bootstrap', 'ngAnimate', 'uiSwitch']);

app.config(function($routeProvider){

	$routeProvider
		.when('/',
			{
				redirectTo: "/spotfilter"
			}
		)
		.when('/spotfilter',
			{
				templateUrl: "templates/spotfilter.html",
				controller: "spotfilterController",
			}
		)
		.when('/settings',
			{
				templateUrl: "templates/settings.html",
				controller: "settingsController",
			}
		)
		.when('/logger',
			{
				templateUrl: "templates/logger.html",
				controller: "loggerController",
			}
		)
		.when('/help',
			{
				templateUrl: "templates/help.html",
				controller: "helpController",
			}
		)
		.otherwise(
			{
				redirectTo: "/spotfilter"
			}
		);
	})

	.config(function($logProvider){
  		$logProvider.debugEnabled(false);
	})

	.run(function($rootScope, $location, $anchorScroll, $routeParams, $log, $window) {
		//when the route is changed scroll to the proper element.
		$rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
	    	$location.hash($routeParams.scrollTo);
	    	$anchorScroll();
	    	$window.scrollTo(window.pageXOffset, window.pageYOffset - 40);
		});
	})

	.run(function($rootScope, $location, $window, $log){
    	$rootScope
        	.$on('$routeChangeSuccess',
            	function(event){
 					$log.debug("Google Analytics Page View");
                	if (!$window.ga)
                    	return;

                	$window.ga('send', 'pageview', { page: document.location.pathname + document.location.search + document.location.hash });
        		}
        	);
	})

	.controller("AppController", function($scope, $log, alertService){
		$scope.sidebarToggled = true;
		$scope.alerts = alertService;

	});
