angular.module("SpotJams")

.directive("peopleList", function () {
	return {
		restrict: 'E',
		templateUrl: "templates/directives/lists/people-list.html",
		scope: {
			people: "=",
		},
	}
})

.controller("PeopleListController", function($scope, $rootScope) {
	var self = $scope;
})