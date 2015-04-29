angular.module('SpotJams')

.controller("PlayerDialogController", function($location, $scope, profileService) {

	$scope.playing = false;
	$scope.playedContent = 10;
	$scope.loadedContent = 27;

    var tracks = profileService.get().tracks
    $scope.tracks = tracks;
    if ($scope.tracks.length > 0) {
        $scope.currentTrack = $scope.tracks[0];
    }

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

	$scope.prev = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("prev!")
        audio.play();

	}

	$scope.next = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("next!")
        audio.pause();

	}

	$scope.load = function(event, url) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("load!")
	
		var audio = document.getElementById("music");
        audio.setAttribute('src', url)
        audio.load();
	}

	$scope.settings = function(event, url) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("settings!")

	}


});
