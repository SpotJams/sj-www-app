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
    var self = $scope;


    if (hasGetUserMedia()) {
        console.log("Has GET USER MEDIA")
        navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
    } else {
        alert("This browser does not support sufficient Web Audio interfaces for recording. Download the mobile app or try chrome on a desktop or android.")
    }


    self.filename = "SpotJams/tracks/recording.m4a";

    self.isRecording = false;
    self.hasRecording = false;
    self.isPlaying = false;
    self.isPaused = false;

    self.timer = null;
    self.recTime = 0.0;
    self.playTime = 0.0;
    self.totalTime = 0.0;

    self.recIndex = 1;

    self.audioContext = null;
    self.audioRecorder = null;
    self.audioStream = null;
    self.analyserNode = null;
    self.analyserContext = null;

    self.track = {
        title: "Track Title",
        description: "tell us about this track!"
    }


    /***********************/

    // get the input audio stream and set up the nodes
    self.initRecorder = function() {
        console.log("init recording")
        try {
            console.log("GOT HERE 1")
            navigator.getUserMedia({
                    video: false,
                    audio: true
                },
                gotStream,
                function(error) {
                    console.log("Error in: getUserMedia: ", error)
                });
            console.log("GOT HERE 2")
        } catch (e) {
            alert('navigator.getUserMedia threw exception :' + e);
        }
    }

    self.initRecorder();

    function gotStream(stream) {
        console.log("gotStream A", self.audioContext)

        self.audioContext = new AudioContext();
        self.audioStream = stream;

        console.log("gotStream A", self.audioContext)

        self.inputPoint = self.audioContext.createGain();
        self.zeroGain = self.audioContext.createGain();
        self.zeroGain.gain.value = 0.0;

        // Create an AudioNode from the stream.
        realAudioInput = self.audioContext.createMediaStreamSource(stream);
        self.sourceNode = realAudioInput;

        self.analyserNode = self.audioContext.createAnalyser();
        self.analyserNode.fftSize = 2048;

        self.audioRecorder = new Recorder(self.inputPoint);
        console.log("gotStream B", self.audioRecorder)

        // connections
        self.sourceNode.connect(self.inputPoint);

        self.inputPoint.connect(self.analyserNode);
        self.inputPoint.connect(self.zeroGain);

        self.zeroGain.connect(self.audioContext.destination);

        console.log("gotStream END")
        updateAnalysers();
    }

    self.startRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("start recording", self.audioRecorder)

        self.audioRecorder.record();


        self.recTime = 0;
        self.startTime = new Date().getTime()
        self.timer = setInterval(function() {
            var currTime = new Date().getTime();
            var currDiff = currTime - self.startTime;
            self.recTime = currDiff / 1000.0;
            self.$apply()
        }, 100);

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

        self.audioRecorder.stop();
        self.audioRecorder.getBuffers(gotBuffers);

        // if (self.audioStream) self.audioStream.stop();
        // if (self.sourceNode) self.sourceNode.disconnect();

        self.isRecording = false;
        self.hasRecording = true;

    }

    self.clearRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("clear recording")

        self.audioRecorder.clear();

        self.isRecording = false;
        self.hasRecording = false;
        self.isPlaying = false;
        self.isPaused = false;

        self.recTime = 0;
        self.totalTime = 0;
    }

    self.downloadRecording = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("download recording")

        self.audioRecorder.exportWAV(doneEncoding);

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



    }

    function cancelAnalyserUpdates() {
        window.cancelAnimationFrame(rafID);
        rafID = null;
    }

    function updateAnalysers(time) {
        if (!self.analyserContext) {
            var canvas = document.getElementById("analyzer");
            canvasWidth = canvas.width;
            canvasHeight = canvas.height;
            self.analyserContext = canvas.getContext('2d');
        }

        // analyzer draw code here
        {
            var SPACING = 3;
            var BAR_WIDTH = 1;
            var numBars = Math.round(canvasWidth / SPACING);
            var freqByteData = new Uint8Array(self.analyserNode.frequencyBinCount);

            self.analyserNode.getByteFrequencyData(freqByteData);

            self.analyserContext.clearRect(0, 0, canvasWidth, canvasHeight);
            self.analyserContext.fillStyle = '#F6D565';
            self.analyserContext.lineCap = 'round';
            var multiplier = self.analyserNode.frequencyBinCount / numBars;

            // Draw rectangle for each frequency bin.
            for (var i = 0; i < numBars; ++i) {
                var magnitude = 0;
                var offset = Math.floor(i * multiplier);
                // gotta sum/average the block, or we miss narrow-bandwidth spikes
                for (var j = 0; j < multiplier; j++)
                    magnitude += freqByteData[offset + j];
                magnitude = magnitude / multiplier;
                var magnitude2 = freqByteData[i * multiplier];
                self.analyserContext.fillStyle = "hsl( " + Math.round((i * 360) / numBars) + ", 100%, 50%)";
                self.analyserContext.fillRect(i * SPACING, canvasHeight, BAR_WIDTH, -magnitude);
            }
        }

        rafID = window.requestAnimationFrame(updateAnalysers);
    }


    function doneEncoding(blob) {
        var filename = "myRecording" + ((self.recIndex < 10) ? "0" : "") + self.recIndex + ".wav"
        console.log(filename, blob)
        Recorder.setupDownload(blob, filename);
        self.recIndex++;
    }


    function gotBuffers(buffers) {
        var canvas = document.getElementById("wavedisplay");

        drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0]);

        // the ONLY time gotBuffers is called is right after a new recording is completed - 
        // so here's where we should set up the download.
        self.audioRecorder.exportWAV( doneEncoding );
    }

    function drawBuffer(width, height, context, data) {
        var step = Math.ceil(data.length / width);
        var amp = height / 2;
        context.fillStyle = "silver";
        context.clearRect(0, 0, width, height);
        for (var i = 0; i < width; i++) {
            var min = 1.0;
            var max = -1.0;
            for (j = 0; j < step; j++) {
                var datum = data[(i * step) + j];
                if (datum < min)
                    min = datum;
                if (datum > max)
                    max = datum;
            }
            context.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
        }
    }

})