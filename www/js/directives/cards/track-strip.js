angular.module("SpotJams")

.directive("trackStrip", function() {
    return {
        restrict: 'E',
        templateUrl: "templates/directives/cards/track-strip.html",
        scope: {
            track: "=",
        },
        link: function(scope, element, attrs, parentCtrl) {
            // do init stuff here

            scope.cardHidden = true;

        },
    }
})

.controller("TrackStripController", function($scope, $location) {
    var self = $scope;

    self.showCard = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        self.cardHidden = false;
    }

    self.hideCard = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        self.cardHidden = true;
    }

    self.gotoTrack = function(event, tid) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $location.path("/track/" + tid)

    }

    self.playNow = function(event, tid) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("track - playNow", tid)

        var plc = angular.element($('#playlist-container'))
        plc.scope().addPlayTrack(null,self.track);

        // $mdToast.show(
        //   $mdToast.simple()
        //     .content('Playing: ' + self.track.title)
        // );

    }

    self.addQueue = function(event, tid) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("track - addQueue", tid)

        var plc = angular.element($('#playlist-container'))
        plc.scope().addTrackBack(self.track);

        // $mdToast.show(
        //   $mdToast.simple()
        //     .content('Queuing: ' + self.track.title)
        //     // .position($scope.getToastPosition())
        //     // .hideDelay(3000)
        // );

    }

})