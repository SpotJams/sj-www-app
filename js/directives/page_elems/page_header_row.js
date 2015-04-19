angular.module("SpotJams")
	.directive("pageHeaderRow", function() {
		return {
			restrict: "E",
			templateUrl: "templates/directives/page_elems/page_header_row.html",
			scope: {
				image: "@",
				name: "@",
				brief: "@",
			}			
		};
	});