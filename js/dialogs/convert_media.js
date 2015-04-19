var recordAudio;
var audioPreview = document.getElementById('audio-preview');
var inner = document.querySelector('.inner');

document.querySelector('#record-audio').onclick = function() {
    this.disabled = true;
    navigator.getUserMedia({
        audio: true
    }, function(stream) {
        audioPreview.src = window.URL.createObjectURL(stream);
        audioPreview.play();

        recordAudio = RecordRTC(stream, {
            bufferSize: 16384
        });

        recordAudio.startRecording();
    }, function(error) {
        throw error;
    });
    document.querySelector('#stop-recording-audio').disabled = false;
};

document.querySelector('#stop-recording-audio').onclick = function() {
    this.disabled = true;

    recordAudio.stopRecording(function(url) {
        audioPreview.src = url;
        audioPreview.download = 'Orignal.wav';

        log('<a href="' + workerPath + '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file download started. It is about 18MB in size; please be patient!');
        convertStreams(recordAudio.getBlob());
    });
};

// var workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
var workerPath = 'https://4dbefa02675a4cdb7fc25d009516b060a84a3b4b.googledrive.com/host/0B6GWd_dUUTT8WjhzNlloZmZtdzA/ffmpeg_asm.js';

function processInWebWorker() {
    var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
        type: 'application/javascript'
    }));

    var worker = new Worker(blob);
    URL.revokeObjectURL(blob);
    return worker;
}

var worker;

function convertStreams(audioBlob) {
    var aab;
    var buffersReady;
    var workerReady;
    var posted;

    var fileReader = new FileReader();
    fileReader.onload = function() {
        aab = this.result;
        postMessage();
    };
    fileReader.readAsArrayBuffer(audioBlob);

    if (!worker) {
        worker = processInWebWorker();
    }

    worker.onmessage = function(event) {
        var message = event.data;
        if (message.type == "ready") {
            log('<a href="' + workerPath + '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file has been loaded.');

            workerReady = true;
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            log(message.data);
        } else if (message.type == "start") {
            log('<a href="' + workerPath + '" download="ffmpeg-asm.js">ffmpeg-asm.js</a> file received ffmpeg command.');
        } else if (message.type == "done") {
            log(JSON.stringify(message));

            var result = message.data[0];
            log(JSON.stringify(result));

            var blob = new Blob([result.data], {
                type: 'audio/ogg'
            });

            log(JSON.stringify(blob));

            PostBlob(blob);
        }
    };
    var postMessage = function() {
        posted = true;

        worker.postMessage({
            type: 'command',
            arguments: [
                '-i', 'audio.wav',
                '-c:a', 'libmp3lame',
                // '-b:a', '4800k',
                'output.mp3'
            ],
            files: [{
                data: new Uint8Array(aab),
                name: "audio.wav"
            }]
        });
    };
}

function PostBlob(blob) {
    var audio = document.createElement('audio');
    audio.controls = true;

    var source = document.createElement('source');
    source.src = URL.createObjectURL(blob);
    source.type = 'audio/ogg; codecs=libmp3lame';
    audio.appendChild(source);

    audio.download = 'Converted Audio.ogg';

    inner.appendChild(document.createElement('hr'));
    var h2 = document.createElement('h2');
    h2.innerHTML = '<a href="' + audio.src + '" target="_blank" download="Converted Audio.ogg">Converted Ogg:</a>';
    inner.appendChild(h2);
    inner.appendChild(audio);

    audio.tabIndex = 0;
    audio.focus();

    document.querySelector('#record-audio').disabled = false;
}

var logsPreview = document.getElementById('logs-preview');

function log(message) {
    console.log("ffmpeg: ", message);
}