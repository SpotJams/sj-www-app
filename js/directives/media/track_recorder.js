angular.module("SpotJams")

.directive("trackRecorder", function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/media/track_recorder.html',
        scope: {
            trackname: '='
        },
    }
})

.controller("TrackRecorderController", function($scope, authService, profileService, trackService) {

    var self = $scope;

    self.filename = "SpotJams/tracks/recording.m4a";

    self.isRecording = false;
    self.hasRecording = false;
    self.isPlaying = false;
    self.isPaused = false;

    self.timer = {}
    self.mediaRecorder = {}
    self.mediaPlayer = {}

    self.recTime = 0.0;
    self.playTime = 0.0;
    self.totalTime = 0.0

    self.track = {
        title: "Track Title",
        description: "tell us about this track!"
    }

    self.startRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("init recording")

        function onSuccess(event) {
            console.log("recordAudio():Audio Success");
            console.log("mediaRecorder: ", self.mediaRecorder)
        }

        // onError Callback
        //
        function onError(error) {
            console.log('recordAudio():error: ', error);
        }


        self.mediaRecorder = new Media(self.filename, onSuccess, onError,
            function(status) {
                console.log("Audio Status: " + status, Media.MEDIA_MSG[status]);
            });

        self.mediaRecorder.setVolume(1.0)
        self.mediaRecorder.startRecord()

        self.recTime = 0;
        self.startTime = new Date().getTime()
        self.timer = setInterval(function() {
            var currTime = new Date().getTime();
            var currDiff = currTime - self.startTime;
            self.recTime = currDiff / 1000.0;
            self.$apply()
        }, 100);

        console.log("start recording");
        self.isRecording = true;
    }

    self.stopRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("stop recording")
        clearInterval(self.timer);
        self.timer = {}

        self.mediaRecorder.stopRecord();

        var secret = new Media(self.filename, onSuccess, onError,
            function(status) {
                var local = self;
                console.log("Secret Status: " + status, Media.MEDIA_MSG[status]);
            });

        secret.setVolume(0.0)
        secret.play();
        console.log("secret: play ", secret)

        function onSuccess(event) {
            // console.log("secret():Audio Success");
            // console.log("secret: ", secret)
        }

        // onError Callback
        //
        function onError(error) {
            console.log('secret():error: ', error);
        }


        var counter = 0;
        var timerDur = setInterval(function() {
            // var local = self;
            counter = counter + 100;
            if (counter > 4000) {
                clearInterval(timerDur);
                console.log("Duration XXX timeout")
            }
            var dur = secret.getDuration();
            if (dur > 0) {
                clearInterval(timerDur);
                secret.stop();
                secret.release();
                console.log("Duration XXX success: ", dur)
                self.recTime = dur;
                self.totalTime = dur;
                self.$apply();
            }
        }, 100);

        console.log("mediaRecorder: ", self.mediaRecorder)

        self.isRecording = false;
        self.hasRecording = true;
        self.loadAudio();
    }

    self.clearRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("clear recording")
        self.mediaRecorder.release();
        self.isRecording = false;
        self.hasRecording = false;
        self.isPlaying = false;
        self.isPaused = false;
        self.showRecorder = false;

        self.recTime = 0;
        self.totalTime = 0;
    }


    self.loadAudio = function() {
        console.log("load audio")

        function onSuccess(event) {
            console.log("playerAudio():Audio Success", event);
            console.log("mediaPlayer: ", self.mediaPlayer)
            self.isPlaying = false;
            self.isPaused = false;

        }

        // onError Callback
        //
        function onError(error) {
            console.log('playerAudio():error: ', error);
        }


        self.mediaPlayer = new Media(self.filename, onSuccess, onError,
            function(status) {
                var local = self;
                console.log("Audio Status: " + status, Media.MEDIA_MSG[status]);
            });

        self.playTime = 0;
        self.timer = setInterval(function() {
            self.mediaPlayer.getCurrentPosition(function(position) {
                    if (position >= 0) {
                        self.playTime = position;
                        self.$apply();
                    }
                },
                function(error) {
                    console.log("error getting position: ", error);
                });
        }, 50);

    }

    self.playAudio = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("play audio")

        self.mediaPlayer.setVolume(1.0)
        self.mediaPlayer.play();
        console.log("mediaPlayer: play ", self.mediaPlayer)

        self.isPlaying = true;
        self.isPaused = false;
        console.log(self);
    }

    self.pauseAudio = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("pause audio")
        self.mediaPlayer.pause();
        self.isPlaying = false;
        self.isPaused = true;

        console.log("mediaPlayer: ", self.mediaPlayer)
    }

    self.stopAudio = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("stop audio")

        self.mediaPlayer.stop();
        self.isPlaying = false;
        self.isPaused = false;

        console.log("mediaPlayer: ", self.mediaPlayer)
    }

    self.uploadAudio = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("upload audio")

        navigator.device.capture.captureAudio(captureAudioSuccess, captureAudioError, {
            limit: 1
        });

        // Called when capture operation is finished
        //
        function captureAudioSuccess(mediaFiles) {
            var i, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                console.log(mediaFiles[i]);
                // uploadFile(mediaFiles[i]);
            }
        }

        // Called if something bad happens.
        //
        function captureAudioError(error) {
            var msg = 'An error occurred during capture: ' + error.code;
            navigator.notification.alert(msg, null, 'Uh oh!');
        }
        self.hasRecording = true;
    }

    self.saveTrack = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("save track")

        var track_meta = {
            trackId: "new",
            userId: profileService.uid(),

            trackFN: self.track.title + ".m4a",
            trackURI: "", // remote url

            title: self.track.title,
            description: self.track.description,
            length: self.totalTime,
            // size: self.track_blob.size,

            instruments: [],
            genres: [],
            artists: [],
        }

        var track = {
            meta: track_meta,
        }

        saveMetaAndRecording()

        function saveMetaAndRecording() {
            console.log("saveMeta - ")
            trackService.set(track);
            trackService.saveMeta(function() {
                console.log("saved track meta data")
                self.copyRecordingFile(track_meta.trackFN, loadFileForUpload, function(error) {
                    console.log("error copying media file")
                });
            }, function(error) {
                console.log("error saving track meta data: ", error);
            });
        }


        function loadFileForUpload() {
            console.log("loadFile - ")
            trackService.getFile(function success(fileEntry) {
                console.log("getFile success: ", fileEntry);
                fileEntry.file(function(file) {

                    convertFile(file)

                }, function(error) {
                    error_handle(error);
                });
            }, function(error) {
                console.log("getFile error: ", error)
            })
        }

        function convertFile(file) {
            console.log("convertFile - ", file)

            var reader = new FileReader();

            reader.onloadend = function(evt) {
                var data_raw = evt.target.result;
                var track_tmp = trackService.get();

                console.log("arrayBuf: ", data_raw.length);

                track_tmp.meta.size = data_raw.length;
                track_tmp.data = window.btoa(data_raw);

                uploadTrack(track_tmp);
            };

            reader.onprogress = function(evt) {
                console.log("progress: ", evt)
            }

            reader.readAsBinaryString(file);
        }

        function uploadTrack(uptrack) {
            console.log("uploadTrack - ", uptrack)
                // upload track to server
            trackService.set(uptrack);
            trackService.saveMeta(function() {
                console.log("saved track meta data")

                trackService.upload(function(data) {
                    console.log("uploaded track media data")
                    console.log("got return: ", data);

                    uptrack.trackURL = data.uploadURL;

                    addTrackToProfile(trackService.get())
                }, function(error) {
                    console.log("error uploading track media data: ", error);
                });

            }, function(error) {
                console.log("error saving track meta data: ", error);
            });
        }

        // Add track to profile
        function addTrackToProfile(track) {
            var profile = profileService.get();

            var t = {
                title: track.meta.title,
                description: track.meta.description,
                trackId: track.meta.trackId,
                length: track.meta.length,
                size: track.meta.size,
                uid: track.meta.uid,
            }
            profile.tracks.push(t);
            console.log("profile after adding track: ", profile, profileService.get())
            profileService.save();
        }




        function dataURItoBlob(dataURI, callback) {
            // convert base64 to raw binary data held in a string
            // doesn't handle URLEncoded DataURIs
            var byteString = atob(dataURI.split(',')[1]);

            // separate out the mime component
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

            // write the bytes of the string to an ArrayBuffer
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            // write the ArrayBuffer to a blob, and you're done
            var bb = new window.WebKitBlobBuilder(); // or just BlobBuilder() if not using Chrome
            bb.append(ab);
            return bb.getBlob(mimeString);
        };
        // upload meta to server
        // trackService.uploadMeta(function(data) {
        //  console.log("uploaded track meta data")
        //  console.log("got return: ", data);
        // }, function(error) {
        //  console.log("error uploading track meta data: ", error);
        // });



        // add track meta to user local info (profile or new track list)
    }

    self.copyRecordingFile = function(filename, success_handle, error_handle) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, function(error) {
            error_handle(error);
        });

        function onSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;


            directoryEntry.getFile(self.filename, {
                create: false,
                exclusive: false
            }, function(fileEntry) {
                fileEntry.getParent(function(parentEntry) {

                    console.log(fileEntry)
                    console.log(parentEntry)
                    fileEntry.copyTo(parentEntry, filename, function() {
                        console.log("copy successful", fileEntry)
                        success_handle(filename);
                    }, function(error) {
                        console.log("copy failed: ", error)
                    })
                }, function(error) {
                    error_handle(error);
                });

            }, function(error) {
                error_handle(error);
            });
        }

    }

})