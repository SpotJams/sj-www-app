angular.module("SpotJams")

.directive("trackList", function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/lists/track-list.html',
        scope: {
            tracks: '=',
        },
    }
})

.controller("TrackListController", function($scope) {
    var self = $scope;

    $scope.$on('$viewContentLoaded', function(){
	    //Here your view content is fully loaded !!
	    console.log("TrackList: ", self.tracks);
  });
})
