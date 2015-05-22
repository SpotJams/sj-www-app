angular.module('SpotJams')

.directive("playlist", function() {
    return {
        restrict: 'E',
        templateUrl: "templates/directives/player/playlist.html",
        scope: {
            tracks: "=",
        },
    }
})

.controller("PlaylistController", function($scope, $sce, playlistService, trackService) {
    var ctrl = $scope;

    ctrl.playing = false;
    ctrl.playTime = 0;
    ctrl.playedContent = 0;
    ctrl.mediaPlayer = document.getElementById("music");

    ctrl.currentIndex = 0;


    // ctrl.initWatchers = function() {
        
        $scope.$watch(
            function(scope) {
                return playlistService.get();
            },
            function(newValue, oldValue) {
                ctrl.tracks = newValue;

                console.log("Playlist Changed: ", ctrl.tracks, oldValue);
                if (ctrl.tracks && ctrl.tracks.length > 0) {
                    ctrl.currentTrack = ctrl.tracks[ctrl.currentIndex];
                }
            }
        );

        $scope.$watch(
            function(scope) {
                return scope.tracks
            },
            function(newValue, oldValue) {
                ctrl.tracks = newValue;

                console.log("TrackList Changed: ", ctrl.tracks, oldValue);
                if (ctrl.tracks && ctrl.tracks.length > 0) {
                    ctrl.currentTrack = ctrl.tracks[ctrl.currentIndex];
                }
            }
        );

        $scope.$watch(
            function(scope) {
                return scope.currentIndex
            },
            function(newValue, oldValue) {

                console.log("New Current Index: ", ctrl.currentIndex);
                if (ctrl.tracks && ctrl.tracks.length > 0) {
                    // ctrl.currentIndex = newValue;
                    if (newValue < 0) {
                        ctrl.currentIndex = ctrl.tracks.length - 1;
                    }
                    if (newValue >= ctrl.tracks.length) {
                        ctrl.currentIndex = 0;
                    }

                    ctrl.currentTrack = ctrl.tracks[ctrl.currentIndex];
                }

            }
        );

        $scope.$watch(
            function(scope) {
                return scope.currentTrack
            },
            function(newValue, oldValue) {
                ctrl.currentTrack = newValue;
                console.log("New Current Track: ", ctrl.currentTrack);
                ctrl.playTime = 0;
                ctrl.playedContent = 0;
                if (ctrl.currentTrack) {
                    ctrl.totalTime = ctrl.currentTrack.length;
                    ctrl.loadAudio(ctrl.currentTrack.trackId)
                }
            }
        );

    // }

    $scope.doShowPlayer = function(event,doShow) {
        // var pass = spotjams.clickbuster.onClick(event);
        // if (!pass) {
        //     return;
        // }

        // event.preventDefault();

        console.log("doShowPlayer: ", doShow, event);
        $scope.showPlayer = doShow;
        $scope.showList = false;
    }
    $scope.doShowList = function(event,doShow) {
        // var pass = spotjams.clickbuster.onClick(event);
        // if (!pass) {
        //     return;
        // }
        // event.preventDefault();

        console.log("doShowList: ", doShow, event);
        $scope.showList = doShow;
    }

    $scope.addTrackListBack = function(tracks) {
        $scope.tracks = $scope.tracks.concat(tracks);
    }

    $scope.addTrackListFront = function(tracks) {
        $scope.tracks = tracks.concat($scope.tracks);
    }

    $scope.addTrackListFrontPlay = function(tracks) {
        $scope.tracks = tracks.concat($scope.tracks);
        $scope.currentIndex = 0;
        if (!$scope.playing) {
            $scope.play();
        }
    }

    $scope.addTrackBack = function(track) {
        $scope.tracks.push(track);
    }

    $scope.addTrackFront = function(track) {
        $scope.tracks.unshift(track);
    }

    $scope.insertTrack = function(track, index) {
        if (index == undefined) {
            index = $scope.currentIndex;
        }
        $scope.tracks.splice(index,0,track);
    }

    $scope.removeTrack = function(index) {
        $scope.tracks.splice(index,1)
    }

    $scope.addPlayTrack = function(event,track,index) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        $scope.currentTrack = track;
        $scope.insertTrack(track,index);
        if (!$scope.playing) {
            $scope.play();
        }
    }


    $scope.doPlayTrack = function(event,index) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $scope.currentIndex = index;
        if (!$scope.playing) {
            $scope.playing = true;
        }

    }

    $scope.doRemoveTrack = function(event,index) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        var playing = false;
        if (index == self.currentIndex) {
            console.log("removing current track")
            playing = $scope.playing;
            if (playing) {
                $scope.stop();
            }
        }

        $scope.removeTrack(index);

        if(playing) {
            $scope.play();
        }

    }




    ctrl.play = function(event,index) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        
        console.log("play!")

        ctrl.playing = true;
        ctrl.playTime = 0;

        // TODO on end handler
        // clearInterval(ctrl.timer)

        ctrl.mediaPlayer.play();
        ctrl.timer = setInterval(function() {
            var position = ctrl.mediaPlayer.currentTime
            // console.log(position);
            if (position >= 0) {
                ctrl.playTime = position;
                ctrl.playedContent = (position / ctrl.totalTime) * 100;
                ctrl.$apply();
                
                var did_end = ctrl.mediaPlayer.ended;
                if(did_end){
                    console.log("track ended on own")
                    ctrl.next();
                    ctrl.$apply();
                }
            }

        }, 100);

    }

    ctrl.stop = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("stop!")

        ctrl.playing = false;
        ctrl.mediaPlayer.pause();
        ctrl.mediaPlayer.src = '';
        clearInterval(ctrl.timer)
    }

    ctrl.pause = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("pause!")

        clearInterval(ctrl.timer)
        ctrl.playing = false;
        ctrl.mediaPlayer.pause();

    }

    ctrl.prev = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("prev!")
        console.log("playing? ", ctrl.playing)
        if (ctrl.playing === true) {
            ctrl.mediaPlayer.pause()
            ctrl.playing = true;
        }
        ctrl.mediaPlayer.src = '';
        clearInterval(ctrl.timer)
        ctrl.currentIndex -= 1;
    }

    ctrl.next = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("next!")
        console.log("playing? ", ctrl.playing)
        if (ctrl.playing === true) {
            ctrl.mediaPlayer.pause()
            ctrl.playing = true;
        }
        ctrl.mediaPlayer.src = '';
        clearInterval(ctrl.timer)
        ctrl.currentIndex += 1;
    }

    ctrl.loadAudio = function(trackid, success_handle, error_handle) {
        console.log("load audio")
        console.log("playing? ", ctrl.playing)
            // convert trackid to track meta data

        trackService.downloadMeta(trackid,
            function onSuccess(meta_data) {
                console.log("got meta data: ", meta_data)

                ctrl.trustedURL = $sce.trustAsResourceUrl(meta_data.trackURL);
                console.log("trustedURL: ", ctrl.trustedURL);
                ctrl.mediaPlayer.src = ctrl.trustedURL;
                ctrl.mediaPlayer.load();
                console.log("playing? ", ctrl.playing)
                if (ctrl.playing) {
                    console.log("calling ctrl.play()")
                    ctrl.play();
                }

            },
            function onError(error) {
                console.log("error downloading meta data")
            }
        );

    }




})