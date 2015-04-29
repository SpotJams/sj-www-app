angular.module("SpotJams")
	.directive("pageTitle", function() {
		return {
			restrict: "E",
			templateUrl: "templates/directives/page_elems/page_title.html",
			scope: {
				title: "@",
			}			
		};
	});