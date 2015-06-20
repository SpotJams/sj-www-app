angular.module("SpotJams")

.factory("webTrackRecorder", function($http, authService) {

    var _track_dir = "SpotJams/tracks/";

    var _instance = {}
    _instance._track = {}


    function init_recorder() {

    }

    _instance.newRecording = function() {
    	var context = new AudioContext();

		navigator.getUserMedia({audio: true}, function(stream) {
		  var microphone = context.createMediaStreamSource(stream);
		  // var filter = context.createBiquadFilter();

		  // microphone -> destination.
		  microphone.connect(context.destination);
		  
		  // microphone -> filter -> destination.
		  // microphone.connect(filter);
		  // filter.connect(context.destination);
		}, errorCallback);
    }

    _instance.startRecording = function() {

    }



    return _instance;
})
