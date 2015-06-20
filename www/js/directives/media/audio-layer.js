angular.module("SpotJams")

.directive("audioLayer", function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/media/audio-layer.html',
        scope: {
            layer: '='
        },
    }
})

.controller("audioLayerController", function($scope, authService, profileService, trackService) {

	console.log("layer: ", $scope.layer)
    

    self.track = {
        title: "Track Title",
        description: "tell us about this track!"
    }


})
