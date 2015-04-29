angular.module("SpotJams")

.directive("personCard", function () {
	return {
		restrict: 'E',
		templateUrl: "templates/directives/cards/person-card.html",
		scope: {
			person: "=",
		},
	}
})

.controller("PersonCardController", function($scope) {
	var self = $scope;


})