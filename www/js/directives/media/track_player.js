angular.module("SpotJams")

.directive("trackPlayer", function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/media/track_player.html',
        scope: {
            trackid: '=',
        },
    }
})

.controller("TrackPlayerController", function($scope, $sce, authService, profileService, trackService) {

    var self = $scope;
    self.mediaPlayer = {}

    self.isPlaying = false;
    self.isPaused = false;

    self.playTime = 0.0;
    self.timer = {}

    self.trustedURL = ""
    self.track = {
        meta: {},
    }


    self.loadAudio = function(trackid, success_handle, error_handle) {
        console.log("load audio")
            // convert trackid to track meta data

        if (!trackid) {
            error_handle({
                error: "no track id"
            });
            return
        }

        trackService.downloadMeta(trackid,
            function onSuccess(meta_data) {
                console.log("got meta data: ", meta_data)

                self.track.meta = meta_data;

                // self.trustedURL = $sce.trustAsResourceUrl(meta_data.trackURL);
                // console.log(self.trustedURL);
                
                self.totalTime = meta_data.length;
            },
            function onError(error) {
                console.log("error downloading meta data")
            }
        );

    }



    // // self.$watch("trackid", function(value) {
    //     console.log("viewLoaded: ", self.trackid);
    //     console.log(self.track);
    //     self.loadAudio(self.trackid,
    //         function onSuccess() {
    //             console.log("loaded audio !!!", self.track);
    //         },
    //         function onError(error) {
    //             console.log("error loading audio: ", error)
    //         });
    // // });

    self.$watch("trackid", function(value) {
        console.log("trackid changed: ", self.trackid);
        console.log(self.track);
        self.loadAudio(self.trackid,
            function onSuccess() {
                console.log("loaded audio !!!", self.track);
            },
            function onError(error) {
                console.log("error loading audio: ", error)
            });
    });


});