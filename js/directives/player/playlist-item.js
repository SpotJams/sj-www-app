angular.module('SpotJams')

.directive("playlistItem", function () {
	return {
		restrict: 'E',
		templateUrl: "templates/directives/player/playlist-item.html",
		scope: {
			track: "=",
		},
	}
})

.controller("PlaylistItemController", function($scope) {
	var self = $scope;


})