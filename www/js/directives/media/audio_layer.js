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

    if (window.isMac) {
    	alert("Web Audio API is not supported in this browser. Try Chrome, it works and is safer :]")
    	return;
    }

    try {
        self.audioContext = new AudioContext();
    } catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

    self.analyserNode;
    self.javascriptNode;
    self.sampleSize = 1024;  // number of samples to collect before analyzing
                            // decreasing this gives a faster sonogram, increasing it slows it down
    self.amplitudeArray;     // array to hold frequency data
    self.audioStream;

    // Global Variables for Drawing
    self.column = 0;
    self.canvasWidth  = 600;
    self.canvasHeight = 256;
    self.ctx = angular.element($("#canvas")).get()[0].getContext("2d");


    self.track = {
        title: "Track Title",
        description: "tell us about this track!"
    }

    function setupAudioNodes(stream) {
        // create the media stream from the audio input source (microphone)
        self.sourceNode = self.audioContext.createMediaStreamSource(stream);
        self.audioStream = stream;

        self.analyserNode   = self.audioContext.createAnalyser();
        self.javascriptNode = self.audioContext.createScriptProcessor(self.sampleSize, 1, 1);

        // Create the array for the data values
        self.amplitudeArray = new Uint8Array(self.analyserNode.frequencyBinCount);

        // setup the event handler that is triggered every time enough samples have been collected
        // trigger the audio analysis and draw one column in the display based on the results
        self.javascriptNode.onaudioprocess = function () {

            self.amplitudeArray = new Uint8Array(self.analyserNode.frequencyBinCount);
            self.analyserNode.getByteTimeDomainData(self.amplitudeArray);

            // draw one column of the display
            requestAnimFrame(drawTimeDomain);
        }

        // Now connect the nodes together
        // Do not connect source node to destination - to avoid feedback
        self.sourceNode.connect(self.analyserNode);
        self.analyserNode.connect(self.javascriptNode);
        self.javascriptNode.connect(self.audioContext.destination);
    }

    function drawTimeDomain() {
        var minValue = 9999999;
        var maxValue = 0;

        for (var i = 0; i < self.amplitudeArray.length; i++) {
            var value = self.amplitudeArray[i] / 256;
            if(value > maxValue) {
                maxValue = value;
            } else if(value < minValue) {
                minValue = value;
            }
        }

        var y_lo = self.canvasHeight - (self.canvasHeight * minValue) - 1;
        var y_hi = self.canvasHeight - (self.canvasHeight * maxValue) - 1;

        self.ctx.fillStyle = '#ffffff';
        self.ctx.fillRect(self.column,y_lo, 1, y_hi - y_lo);

        // loop around the canvas when we reach the end
        self.column += 1;
        if(self.column >= self.canvasWidth) {
            self.column = 0;
            clearCanvas();
        }
    }

    function clearCanvas() {
        self.column = 0;
        self.ctx.clearRect(0, 0, self.canvasWidth, self.canvasHeight);
        // self.ctx.beginPath();
        self.ctx.strokeStyle = '#f00';
        var y = (self.canvasHeight / 2) + 0.5;
        self.ctx.moveTo(0, y);
        self.ctx.lineTo(self.canvasWidth-1, y);
        self.ctx.stroke();
    }

    self.startRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("init recording")

        // onError Callback
        function onError(error) {
            console.log('recordAudio():error: ', error);
        }

		clearCanvas();

            // get the input audio stream and set up the nodes
            try {
                navigator.getUserMedia(
                  { video: false,
                    audio: true},
                  setupAudioNodes,
                  onError);
            } catch (e) {
                alert('webkitGetUserMedia threw exception :' + e);
            }

		// var errorCallback = function(e) {
		//     console.log('Reeeejected!', e);
		// };

		// var context = new AudioContext();
		// navigator.getUserMedia({audio: true}, function(stream) {
		//   var microphone = context.createMediaStreamSource(stream);
		  
		//   // microphone -> filter -> destination.
		//   // var filter = context.createBiquadFilter();
		//   // microphone.connect(filter);
		//   // filter.connect(context.destination);

		//   // microphone -> destination.
		//   microphone.connect(context.destination);
		
		// 	self.recTime = 0;
	 //        self.startTime = new Date().getTime()
	 //        self.timer = setInterval(function() {
	 //            var currTime = new Date().getTime();
	 //            var currDiff = currTime - self.startTime;
	 //            self.recTime = currDiff / 1000.0;
	 //            self.$apply()
	 //        }, 100);

	 //        console.log("start recording");
	 //        self.isRecording = true;

	          
		// }, errorCallback);



        
    }

    self.stopRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("stop recording")
        clearInterval(self.timer);
        self.timer = {}

        self.javascriptNode.onaudioprocess = null;
        if(self.audioStream) self.audioStream.stop();
        if(self.sourceNode)  self.sourceNode.disconnect();


        // self.mediaRecorder.stopRecord();

        // var secret = new Media(self.filename, onSuccess, onError,
        //     function(status) {
        //         var local = self;
        //         console.log("Secret Status: " + status, Media.MEDIA_MSG[status]);
        //     });

        // secret.setVolume(0.0)
        // secret.play();
        // console.log("secret: play ", secret)

        // function onSuccess(event) {
        //     // console.log("secret():Audio Success");
        //     // console.log("secret: ", secret)
        // }

        // // onError Callback
        // //
        // function onError(error) {
        //     console.log('secret():error: ', error);
        // }


        // var counter = 0;
        // var timerDur = setInterval(function() {
        //     // var local = self;
        //     counter = counter + 100;
        //     if (counter > 4000) {
        //         clearInterval(timerDur);
        //         console.log("Duration XXX timeout")
        //     }
        //     var dur = secret.getDuration();
        //     if (dur > 0) {
        //         clearInterval(timerDur);
        //         secret.stop();
        //         secret.release();
        //         console.log("Duration XXX success: ", dur)
        //         self.recTime = dur;
        //         self.totalTime = dur;
        //         self.$apply();
        //     }
        // }, 100);

        // console.log("mediaRecorder: ", self.mediaRecorder)

        self.isRecording = false;
        self.hasRecording = true;
        // self.loadAudio();
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