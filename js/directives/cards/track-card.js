angular.module("SpotJams")

.directive("trackCard", function () {
	return {
		restrict: 'E',
		templateUrl: "templates/directives/cards/track-card.html",
		scope: {
			person: "=",
		},
	}
})

.controller("TrackCardController", function($scope) {
	var self = $scope;


})