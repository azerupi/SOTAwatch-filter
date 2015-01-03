app.directive('mdUrl', function($location){
	return {
		link: function(scope, element, attrs){
			element.on('click', function(event){
				event.preventDefault();
				event.stopPropagation();
				scope.$apply(function() {
                    $location.path(attrs.mdUrl);
                });
			});
		},
	};
});