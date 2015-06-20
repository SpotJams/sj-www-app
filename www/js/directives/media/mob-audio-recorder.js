angular.module("SpotJams")

.directive("audioRecorder", function() {
    return {
        restrict: 'E',
        templateUrl: 'templates/directives/media/audio-recorder.html',
        scope: {
            layer: '='
        },
    }
})

.controller("audioRecorderController", function($scope, authService, profileService, trackService) {

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

//    if (window.isMac) {
//    	alert("Web Audio API is not supported in this browser. Try Chrome, it works and is safer :]")
//    	return;
//    }

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

function doneEncoding( blob ) {
    Recorder.setupDownload( blob, "myRecording" + ((recIndex<10)?"0":"") + recIndex + ".wav" );
    recIndex++;
}

function cancelAnalyserUpdates() {
    window.cancelAnimationFrame( rafID );
    rafID = null;
}

function updateAnalysers(time) {
    if (!analyserContext) {
        var canvas = document.getElementById("analyser");
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        analyserContext = canvas.getContext('2d');
    }

    // analyzer draw code here
    {
        var SPACING = 3;
        var BAR_WIDTH = 1;
        var numBars = Math.round(canvasWidth / SPACING);
        var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);

        analyserNode.getByteFrequencyData(freqByteData); 

        analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
        analyserContext.fillStyle = '#F6D565';
        analyserContext.lineCap = 'round';
        var multiplier = analyserNode.frequencyBinCount / numBars;

        // Draw rectangle for each frequency bin.
        for (var i = 0; i < numBars; ++i) {
            var magnitude = 0;
            var offset = Math.floor( i * multiplier );
            // gotta sum/average the block, or we miss narrow-bandwidth spikes
            for (var j = 0; j< multiplier; j++)
                magnitude += freqByteData[offset + j];
            magnitude = magnitude / multiplier;
            var magnitude2 = freqByteData[i * multiplier];
            analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
            analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
        }
    }
    
    rafID = window.requestAnimationFrame( updateAnalysers );
}
function gotStream(stream) {
    inputPoint = audioContext.createGain();

    // Create an AudioNode from the stream.
    realAudioInput = audioContext.createMediaStreamSource(stream);
    audioInput = realAudioInput;
    audioInput.connect(inputPoint);

//    audioInput = convertToMono( input );

    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 2048;
    inputPoint.connect( analyserNode );

    audioRecorder = new Recorder( inputPoint );

    zeroGain = audioContext.createGain();
    zeroGain.gain.value = 0.0;
    inputPoint.connect( zeroGain );
    zeroGain.connect( audioContext.destination );
    updateAnalysers();
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

/*
 self.showTrackDialog = function(evt) {
 var setup = self;
 
 evt.preventDefault();
 console.log("showImageDialog - doing", evt);
 
 var recordAudio;
 var audioPreview = document.getElementById('audio-preview');
 setup.audioPreview = angular.element(audioPreview);
 
 var parentEl = angular.element(document.body);
 $mdDialog.show({
 parent: parentEl,
 targetEvent: evt,
 templateUrl: "templates/dialogs/upload_track.html",
 controller: DialogController
 });
 
 function DialogController(scope, $mdDialog) {
 // TODO make directory for recordings if not present
 var src = "SpotJams/recordings/recording.mp3";
 scope.mediaRec = new Media(src, onSuccess, onError,
 function(status) {
 console.log("recordAudio():Audio Status: " + status);
 // setAudioStatus(Media.MEDIA_MSG[status]);
 });
 var recInterval;
 var recTime = 0;
 scope.recording = false;
 scope.converting = false;
 scope.recordingDone = false;
 
 var ctrl = scope;
 
 // scope.isRecording = function() {
 //     return recording;
 // }
 
 // scope.isConverting = function() {
 //     return converting;
 // }
 
 // scope.isRecordingDone = function() {
 //     return recordingDone;
 // }
 
 scope.startRecording = function() {
 document.getElementById('stop-recording-audio').disabled = false;
 document.getElementById('start-recording-audio').disabled = true;
 
 // Record audio
 ctrl.recording = true;
 ctrl.mediaRec.startRecord();
 recTime = 0;
 
 recInterval = setInterval(function() {
 recTime = recTime + 1;
 setAudioPosition(recTime + " sec");
 }, 1000);
 
 // navigator.getUserMedia({
 //     audio: true
 // }, function(stream) {
 //     audioPreview.src = window.URL.createObjectURL(stream);
 //     audioPreview.play();
 
 //     recordAudio = RecordRTC(stream, {
 //         bufferSize: 16384
 //     });
 
 //     recordAudio.startRecording();
 // }, function(error) {
 //     throw error;
 // });
 }
 
 // onSuccess Callback
 //
 function onSuccess(_event) {
 console.log("recordAudio():Audio Success");
 console.log("mediaRec: ", _event)
 }
 
 // onError Callback
 //
 function onError(error) {
 console.log('error: ', error);
 }
 
 function setAudioPosition(position) {
 document.getElementById('audio_position').innerHTML = position;
 }
 
 scope.stopRecording = function() {
 document.getElementById('stop-recording-audio').disabled = true;
 
 clearInterval(recInterval);
 this.mediaRec.stopRecord();
 
 ctrl.recording = false;
 ctrl.converting = true;
 
 var this_ctrl = ctrl;
 console.log("mediaRec: ", this.mediaRec)
 
 requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onFileError);
 
 function onFileSuccess(fileSystem) {
 var directoryEntry = fileSystem.root;
 
 // write profile file
 directoryEntry.getFile("SpotJams/recordings/recording.wav", {
 create: false,
 exclusive: false
 }, function(fileEntry) {
 //lets write something into the file
 function win(file) {
 console.log("Reading File: ", file);
 
 var size = document.getElementById('track-size')
 size.innerHTML = file.size / 1024.0;
 
 
 var reader = new FileReader();
 reader.onloadend = function(evt) {
 var local_ctrl = this_ctrl;
 var file_contents = evt.target.result;
 console.log("File Contents: ", file_contents)
 
 // set audio element as WAV file
 var elem = document.getElementById('audio-preview')
 elem.src = file_contents;
 
 $rootScope.$apply(function() {
 local_ctrl.converting = false;
 local_ctrl.recordingDone = true;
 })
 
 
 elem.addEventListener("loadedmetadata", function(_event) {
 //TODO whatever
 console.log(_event)
 var a = _event.srcElement;
 
 // var start = this.seekable.start(0);  // Returns the starting time (in seconds)
 // var end = this.seekable.end(0);    // Returns the ending time (in seconds)
 
 
 console.log("duration:  ", a.duration)
 // console.log("end-start: ", end-start)
 });
 elem.addEventListener("canplay", function(_event) {
 console.log("canplay")
 console.log("duration:  ", _event.target.duration)
 }, true);
 
 elem.addEventListener("canplaythrough", function(_event) {
 console.log("canplaythrough")
 console.log("duration:  ", _event.target.duration)
 }, true);
 };
 //to read the content as binary use readAsArrayBuffer function.
 reader.readAsDataURL(file);
 
 // --------------------------------------------------------
 // var arrayer = new FileReader();
 // arrayer.onloadend = function(evt) {
 //     // convert to ogg
 //     var file_contents = evt.target.result;
 
 //     console.log("ArrayBuffer: ", file_contents)
 
 // var capture = convertOGG(file_contents, 0.4);
 
 // var result = capture.stop();
 
 // result.then(function(blob) {
 //     var url = URL.createObjectURL(blob);
 //     // Android Chrome BUG:
 //     // need to download local blob for some reason
 //     return downloadBlob(url);
 // }).then(function(blob) {
 //     var url = URL.createObjectURL(blob);
 
 //     // set audio element as OGG file
 //     var recording = document.getElementById('track-container')
 //     done = true;
 
 //     // var audio = recording.querySelector('audio');
 //     // audio.src = url;
 
 //     var size = recording.querySelector('[data-key=size] ~ .value');
 //     size.innerText = blob.size;
 // this_ctrl.converting = false;
 // this_ctrl.recordingDone = true;
 //     capture = null;
 // });
 
 // save as file
 
 // upload to server
 // };
 //to read the content as binary use readAsArrayBuffer function.
 // arrayer.readAsArrayBuffer(file);
 
 
 };
 
 var fail = function(error) {
 console.log(error.code);
 };
 
 fileEntry.file(win, fail);
 }, function(error) {
 console.log("Error occurred while getting a pointer to file. Error code is: " + error.DOMError);
 return;
 });
 
 }
 
 function onFileError(evt) {
 console.log("Error occurred during request to file system pointer. Error code is: " + evt.code);
 }
 
 }
 
 function downloadBlob(url) {
 return new Promise(function(resolve, reject) {
 var xhr = new XMLHttpRequest();
 xhr.open('GET', url, true);
 xhr.responseType = 'blob';
 
 xhr.onload = function() {
 resolve(xhr.response)
 };
 
 xhr.onerror = reject;
 
 xhr.send();
 });
 }
 
 function convertOGG(file, quality) {
 var bufferSize = 4 * 1024;
 
 // var audioContext = new AudioContext();
 // var audioSourceNode = audioContext.createMediaStreamSource(stream);
 // var scriptProcessorNode = audioContext.createScriptProcessor(bufferSize);
 
 var channels = 2;
 // var sampleRate = audioContext.sampleRate;
 var sampleRate = 8000;
 
 var encoder =
 Vorbis.Encoding.createVBR(channels, sampleRate, quality)
 .then(Vorbis.Encoding.writeHeaders);
 
 return encoder.then(Vorbis.Encoding.finish);
 
 
 
 // scriptProcessorNode.onaudioprocess = function(ev) {
 //     var inputBuffer = ev.inputBuffer;
 //     var samples = inputBuffer.length;
 
 //     var ch0 = inputBuffer.getChannelData(0);
 //     var ch1 = inputBuffer.getChannelData(1);
 
 //     // script processor reuses buffers; we need to make copies
 //     ch0 = new Float32Array(ch0);
 //     ch1 = new Float32Array(ch1);
 
 //     // Float32Array is not Transferrable
 //     // so we get the underlying ArrayBuffer
 //     var buffers = [ch0.buffer, ch1.buffer];
 
 //     encoder = encoder.then(Vorbis.Encoding.encodeTransfer(samples, buffers));
 // };
 
 // audioSourceNode.connect(scriptProcessorNode);
 // scriptProcessorNode.connect(audioContext.destination);
 
 // return {
 //     stop: function() {
 //         audioSourceNode.disconnect(scriptProcessorNode);
 //         scriptProcessorNode.disconnect(audioContext.destination);
 
 //         return encoder.then(Vorbis.Encoding.finish);
 //     }
 // };
 }
 
 scope.saveTrack = function() {
 
 console.log("Saving track")
 $mdDialog.hide();
 
 }
 
 scope.closeDialog = function() {
 $mdDialog.hide();
 }
 
 scope.getAudio = function(evt) {
 console.log("getAudio - doing", evt);
 evt.preventDefault();
 
 // Launch device audio recording application,
 navigator.device.capture.captureAudio(captureAudioSuccess, captureAudioError, {
 limit: 1
 });
 }
 }
 
 }
 
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
 
 
 }         self.showTrackDialog = function(evt) {
 var setup = self;
 
 evt.preventDefault();
 console.log("showImageDialog - doing", evt);
 
 var recordAudio;
 var audioPreview = document.getElementById('audio-preview');
 setup.audioPreview = angular.element(audioPreview);
 
 var parentEl = angular.element(document.body);
 $mdDialog.show({
 parent: parentEl,
 targetEvent: evt,
 templateUrl: "templates/dialogs/upload_track.html",
 controller: DialogController
 });
 
 function DialogController(scope, $mdDialog) {
 // TODO make directory for recordings if not present
 var src = "SpotJams/recordings/recording.mp3";
 scope.mediaRec = new Media(src, onSuccess, onError,
 function(status) {
 console.log("recordAudio():Audio Status: " + status);
 // setAudioStatus(Media.MEDIA_MSG[status]);
 });
 var recInterval;
 var recTime = 0;
 scope.recording = false;
 scope.converting = false;
 scope.recordingDone = false;
 
 var ctrl = scope;
 
 // scope.isRecording = function() {
 //     return recording;
 // }
 
 // scope.isConverting = function() {
 //     return converting;
 // }
 
 // scope.isRecordingDone = function() {
 //     return recordingDone;
 // }
 
 scope.startRecording = function() {
 document.getElementById('stop-recording-audio').disabled = false;
 document.getElementById('start-recording-audio').disabled = true;
 
 // Record audio
 ctrl.recording = true;
 ctrl.mediaRec.startRecord();
 recTime = 0;
 
 recInterval = setInterval(function() {
 recTime = recTime + 1;
 setAudioPosition(recTime + " sec");
 }, 1000);
 
 // navigator.getUserMedia({
 //     audio: true
 // }, function(stream) {
 //     audioPreview.src = window.URL.createObjectURL(stream);
 //     audioPreview.play();
 
 //     recordAudio = RecordRTC(stream, {
 //         bufferSize: 16384
 //     });
 
 //     recordAudio.startRecording();
 // }, function(error) {
 //     throw error;
 // });
 }
 
 // onSuccess Callback
 //
 function onSuccess(_event) {
 console.log("recordAudio():Audio Success");
 console.log("mediaRec: ", _event)
 }
 
 // onError Callback
 //
 function onError(error) {
 console.log('error: ', error);
 }
 
 function setAudioPosition(position) {
 document.getElementById('audio_position').innerHTML = position;
 }
 
 scope.stopRecording = function() {
 document.getElementById('stop-recording-audio').disabled = true;
 
 clearInterval(recInterval);
 this.mediaRec.stopRecord();
 
 ctrl.recording = false;
 ctrl.converting = true;
 
 var this_ctrl = ctrl;
 console.log("mediaRec: ", this.mediaRec)
 
 requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSuccess, onFileError);
 
 function onFileSuccess(fileSystem) {
 var directoryEntry = fileSystem.root;
 
 // write profile file
 directoryEntry.getFile("SpotJams/recordings/recording.wav", {
 create: false,
 exclusive: false
 }, function(fileEntry) {
 //lets write something into the file
 function win(file) {
 console.log("Reading File: ", file);
 
 var size = document.getElementById('track-size')
 size.innerHTML = file.size / 1024.0;
 
 
 var reader = new FileReader();
 reader.onloadend = function(evt) {
 var local_ctrl = this_ctrl;
 var file_contents = evt.target.result;
 console.log("File Contents: ", file_contents)
 
 // set audio element as WAV file
 var elem = document.getElementById('audio-preview')
 elem.src = file_contents;
 
 $rootScope.$apply(function() {
 local_ctrl.converting = false;
 local_ctrl.recordingDone = true;
 })
 
 
 elem.addEventListener("loadedmetadata", function(_event) {
 //TODO whatever
 console.log(_event)
 var a = _event.srcElement;
 
 // var start = this.seekable.start(0);  // Returns the starting time (in seconds)
 // var end = this.seekable.end(0);    // Returns the ending time (in seconds)
 
 
 console.log("duration:  ", a.duration)
 // console.log("end-start: ", end-start)
 });
 elem.addEventListener("canplay", function(_event) {
 console.log("canplay")
 console.log("duration:  ", _event.target.duration)
 }, true);
 
 elem.addEventListener("canplaythrough", function(_event) {
 console.log("canplaythrough")
 console.log("duration:  ", _event.target.duration)
 }, true);
 };
 //to read the content as binary use readAsArrayBuffer function.
 reader.readAsDataURL(file);
 
 // --------------------------------------------------------
 // var arrayer = new FileReader();
 // arrayer.onloadend = function(evt) {
 //     // convert to ogg
 //     var file_contents = evt.target.result;
 
 //     console.log("ArrayBuffer: ", file_contents)
 
 // var capture = convertOGG(file_contents, 0.4);
 
 // var result = capture.stop();
 
 // result.then(function(blob) {
 //     var url = URL.createObjectURL(blob);
 //     // Android Chrome BUG:
 //     // need to download local blob for some reason
 //     return downloadBlob(url);
 // }).then(function(blob) {
 //     var url = URL.createObjectURL(blob);
 
 //     // set audio element as OGG file
 //     var recording = document.getElementById('track-container')
 //     done = true;
 
 //     // var audio = recording.querySelector('audio');
 //     // audio.src = url;
 
 //     var size = recording.querySelector('[data-key=size] ~ .value');
 //     size.innerText = blob.size;
 // this_ctrl.converting = false;
 // this_ctrl.recordingDone = true;
 //     capture = null;
 // });
 
 // save as file
 
 // upload to server
 // };
 //to read the content as binary use readAsArrayBuffer function.
 // arrayer.readAsArrayBuffer(file);
 
 
 };
 
 var fail = function(error) {
 console.log(error.code);
 };
 
 fileEntry.file(win, fail);
 }, function(error) {
 console.log("Error occurred while getting a pointer to file. Error code is: " + error.DOMError);
 return;
 });
 
 }
 
 function onFileError(evt) {
 console.log("Error occurred during request to file system pointer. Error code is: " + evt.code);
 }
 
 }
 
 function downloadBlob(url) {
 return new Promise(function(resolve, reject) {
 var xhr = new XMLHttpRequest();
 xhr.open('GET', url, true);
 xhr.responseType = 'blob';
 
 xhr.onload = function() {
 resolve(xhr.response)
 };
 
 xhr.onerror = reject;
 
 xhr.send();
 });
 }
 
 function convertOGG(file, quality) {
 var bufferSize = 4 * 1024;
 
 // var audioContext = new AudioContext();
 // var audioSourceNode = audioContext.createMediaStreamSource(stream);
 // var scriptProcessorNode = audioContext.createScriptProcessor(bufferSize);
 
 var channels = 2;
 // var sampleRate = audioContext.sampleRate;
 var sampleRate = 8000;
 
 var encoder =
 Vorbis.Encoding.createVBR(channels, sampleRate, quality)
 .then(Vorbis.Encoding.writeHeaders);
 
 return encoder.then(Vorbis.Encoding.finish);
 
 
 
 // scriptProcessorNode.onaudioprocess = function(ev) {
 //     var inputBuffer = ev.inputBuffer;
 //     var samples = inputBuffer.length;
 
 //     var ch0 = inputBuffer.getChannelData(0);
 //     var ch1 = inputBuffer.getChannelData(1);
 
 //     // script processor reuses buffers; we need to make copies
 //     ch0 = new Float32Array(ch0);
 //     ch1 = new Float32Array(ch1);
 
 //     // Float32Array is not Transferrable
 //     // so we get the underlying ArrayBuffer
 //     var buffers = [ch0.buffer, ch1.buffer];
 
 //     encoder = encoder.then(Vorbis.Encoding.encodeTransfer(samples, buffers));
 // };
 
 // audioSourceNode.connect(scriptProcessorNode);
 // scriptProcessorNode.connect(audioContext.destination);
 
 // return {
 //     stop: function() {
 //         audioSourceNode.disconnect(scriptProcessorNode);
 //         scriptProcessorNode.disconnect(audioContext.destination);
 
 //         return encoder.then(Vorbis.Encoding.finish);
 //     }
 // };
 }
 
 scope.saveTrack = function() {
 
 console.log("Saving track")
 $mdDialog.hide();
 
 }
 
 scope.closeDialog = function() {
 $mdDialog.hide();
 }
 
 scope.getAudio = function(evt) {
 console.log("getAudio - doing", evt);
 evt.preventDefault();
 
 // Launch device audio recording application,
 navigator.device.capture.captureAudio(captureAudioSuccess, captureAudioError, {
 limit: 1
 });
 }
 }
 
 }
 
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
 
 
 }
*/