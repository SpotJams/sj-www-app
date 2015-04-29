angular.module('SpotJams')

.directive("playlistPlayer", function () {
    return {
        restrict: 'E',
        templateUrl: "templates/directives/player/player.html",
        scope: {
            track: "=",
        },
    }
})

.controller("PlaylistPlayerController", function($location, $scope) {

	$scope.playing = false;
	$scope.playedContent = 10;
	$scope.loadedContent = 27;

	$scope.play = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("play!")
	
		var audio = document.getElementById("music");
        audio.play();
        $scope.playing = true;

	}

	$scope.pause = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("pause!")
    
    	var audio = document.getElementById("music");
	    audio.pause();
        $scope.playing = false;

	}

});
