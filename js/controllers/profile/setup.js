angular.module("SpotJams")
    .controller("SetupController",
        function($rootScope, $scope, $location, $mdDialog, $stateParams, authService, profileService, imageService) {


            // TODO, check if the version on the server is newer
            // this way all of our updates should not conflict
            // unless they are editting form two different devices simultaneously.
            // 
            // THUSSSSS, we should also check the server version change time
            // just before posting

            var self = this;
            self.next_page = $stateParams.next_page;
            console.log("next_page", self.next_page);

            self.saving = 'icon-ok';
            self.dirty = false;

            self.markDirty = function() {
                self.dirty = true;
            }

            self.profile = profileService.get();


            var elem = document.getElementById('profile-location-input');
            console.log(elem);

            // angular.element(elem).geocomplete({
            //     types: ['geocode', 'establishments']
            // })
            angular.element(elem).geocomplete()
                .bind("geocode:result", function(event, result) {
                    console.log("location: ", result)

                    var profile = self.profile;

                    profile.location = result.formatted_address;
                    profile.address = "";

                    var addy_comps = result.address_components;
                    for (var i = 0; i < addy_comps.length; i++) {
                        var ac = addy_comps[i];
                        console.log("parsing ", ac.types[0])
                        switch (ac.types[0]) {
                            case "street_number":
                                profile.address = ac.long_name + " " + profile.address;
                                break;
                            case "route":
                                profile.address = profile.address + ac.long_name;
                                break;
                            case "sublocality":
                                profile.sublocality = ac.long_name;
                                break;
                            case "neighborhood":
                                profile.neighborhood = ac.long_name;
                                break;
                            case "locality":
                                profile.city = ac.long_name;
                                break;
                                // county
                            case "administrative_area_level_2":
                                profile.county = ac.long_name;
                                break;
                                // state
                            case "administrative_area_level_1":
                                profile.state = ac.short_name;
                                break;
                            case "country":
                                profile.country = ac.short_name;
                                break;
                            case "postal_code":
                                profile.zip = ac.long_name;
                                break;
                            case "postal_code_suffix":
                                profile.zipSuffix = ac.long_name;
                                break;
                            case "colloquial_area":
                                profile.colloquial = ac.long_name;
                                break;
                            default:
                                console.log("Unknown address component: ", ac, results)
                        }
                    };

                    console.log("profile: ", self.profile)
                    self.markDirty();
                });



            self.date = new Date(Date.parse(self.profile.birthday));
            self.dateString = self.profile.birthday;

            console.log(self.date, self.dateString);

            if (!self.profile.instruments) {
                self.profile.instruments = [];
            }
            if (!self.profile.genres) {
                self.profile.genres = [];
            }
            if (!self.profile.genresStr) {
                self.profile.genresStr = [];
            }

            console.log("setupCtrl: ", self.profile)



            self.addInstrument = function(item) {
                if (!clickLock()) {
                    return;
                };

                console.log("GOT HERE addInst: ", item)
                var adder = self;
                if (item) {
                    var inst = {
                        'type': item.display,
                    }

                    $scope.selectedItem = {}
                    $scope.searchText = ""
                    
                    var index = adder.profile.instruments.map(function(el) {
                      return el.type;
                    }).indexOf(item.display);
                    
                    console.log("instrument index", index)
                    if (index >= 0) {
                        return;
                    }

                    adder.profile.instruments.push(inst);
                    self.markDirty()
                }
            }

            self.addGenre = function(item) {
                if (!clickLock()) {
                    return;
                };

                console.log("GOT HERE genre: ", item)
                var adder = self;
                if (item) {
                    var genre = {
                        'class': item.display,
                        'displayName': item.display,
                    }
                    $scope.selectedItem = {}
                    $scope.searchText = ""

                    var index = adder.profile.genres.map(function(el) {
                      return el.displayName;
                    }).indexOf(item.display);
                    console.log("genre index", index)
                    
                    if (index >= 0) {
                        return;
                    }

                    adder.profile.genres.push(genre);
                    adder.profile.genresStr.push({
                        'displayName': item.display,
                    });
                    self.markDirty()
                }
            }


            self.alert = '';
            self.showPurposeAlert = function(evt) {
                var pass = spotjams.clickbuster.onClick(evt);
                if (!pass) {
                    return;
                }
                $mdDialog.show(
                    $mdDialog.alert()
                    .title('Coming soon.')
                    .content('Let others know what you\'re up to and why you are here.')
                    .ok('Got it!')
                    // .theme('docs-dark')
                    .targetEvent(evt)
                );
            };


            self.trySave = function(evt) {
                // ngMaterial has issues with multiple click events being fired right now
                var pass = spotjams.clickbuster.onClick(evt);
                if (!pass) {
                    return;
                }
                self.saving = "icon-cloudaltupload";

                evt.preventDefault();

                var setup = self;

                setup.profile.birthday = printDate(setup.date);
                setup.profile.birthdate = setup.date.toISOString();

                console.log(setup.profile)

                profileService.set(setup.profile);
                profileService.save();
                profileService.upload(function success() {
                    self.saving = 'icon-ok';
                    self.dirty = false;
                });


                console.log('You\'re about to go to the intro pages...');

                // $location.path(setup.next_page);

                return;
            }

            self.showImageDialog = function(evt) {

                var pass = spotjams.clickbuster.onClick(evt);
                if (!pass) {
                    return;
                }

                var setup = self;

                evt.preventDefault();
                console.log("showImageDialog - doing", evt);


                var parentEl = angular.element(document.body);
                $mdDialog.show({
                    parent: parentEl,
                    targetEvent: evt,
                    templateUrl: "templates/dialogs/upload_image.html",
                    controller: DialogController
                });

                function DialogController(scope, $mdDialog) {
                    scope.saveImage = function(event) {

                       var pass = spotjams.clickbuster.onClick(event);
                        if (!pass) {
                            return;
                        }

                        console.log("Saving image")

                        var elem = document.querySelector('#image-container > img');
                        var cont = angular.element(elem);

                        var imageCanvas = cont.cropper('getCroppedCanvas', {
                            width: 1024,
                            height: 1024,
                        });

                        var thumbCanvas = cont.cropper('getCroppedCanvas', {
                            width: 96,
                            height: 96,
                        });

                        var image = {
                            meta: {

                                title: 'Profile Image',
                                description: "This is an image... description [].",
                                width: 1024,
                                height: 1024,
                            },
                            // data: blob as base64 encoded,
                            // thumb: blob as base64 encoded,
                        }

                        thumbCanvas.toBlob(function(blob) {

                            setup.imageURI = cont.src;
                            setup.profile.imageURI = setup.imageURI;

                            var reader = new FileReader();
                            reader.onloadend = function() {
                                var local_blob = blob;
                                var local_image = image;
                                local_image.meta.thumbSize = blob.size;
                                var data_url = reader.result;
                                console.log(data_url);
                                // local_image.thumb = data_url;
                                local_image.thumb = data_url.split(',')[1];
                            }
                            reader.readAsDataURL(blob);


                        }, "image/jpeg", 0.9);


                        imageCanvas.toBlob(function(blob) {
                            console.log(blob);

                            var reader = new FileReader();
                            reader.onloadend = function() {
                                var local_blob = blob;
                                var local_image = image;
                                local_image.meta.imageSize = blob.size;
                                var data_url = reader.result;
                                local_image.data = data_url.split(',')[1];

                                console.log("setting profile image: ", local_image)

                                imageService.set(local_image, "profile-image.jpg")

                                // save & upload profile image to server ( FROM HERE BECAUSE IT"S LIKELY TO BE SLOWER)
                                imageService.upload(function success(data) {

                                    console.log("uploaded profile image: ", imageService.get())
                                    // update profile URLs
                                    var profile = profileService.get();
                                    profile.imageURL = imageService.imageURL();
                                    profile.thumbURL = imageService.thumbURL();
                                    console.log("setting image updated profile")
                                    profileService.set(profile);
                                    profileService.save()

                                    setup.profile = profile;
                                }, function(error) {
                                    console.log("error uploading: ", error)
                                    alert(error);
                                });
                            


                            }
                            reader.readAsDataURL(blob);

                            $mdDialog.hide();

                        }, "image/jpeg", 0.9);
                    }

                    scope.rotateCounterClockwise = function() {
                       var pass = spotjams.clickbuster.onClick(event);
                        if (!pass) {
                            return;
                        }

                        var elem = document.querySelector('#image-container > img');
                        var cont = angular.element(elem);
                        cont.cropper('rotate', -90)
                        console.log("Rotating counter-clockwise image")

                    }

                    scope.rotateClockwise = function() {
                       var pass = spotjams.clickbuster.onClick(event);
                        if (!pass) {
                            return;
                        }
                        var elem = document.querySelector('#image-container > img');
                        var cont = angular.element(elem);
                        cont.cropper('rotate', 90)
                        console.log("Rotating clockwise image")

                    }

                    scope.closeDialog = function() {
                        $mdDialog.hide();
                    }

                    scope.pictureSource = navigator.camera.PictureSourceType;
                    scope.destinationType = navigator.camera.DestinationType;
                    scope.capturePhotoWithFile = capturePhotoWithFile;
                    scope.getPhoto = getPhoto;
                }
            }

            function doCropper() {
                var elem = document.querySelector('#image-container > img');
                var cont = angular.element(elem);

                cont.cropper({
                    aspectRatio: 1,
                    // autoCrop: false,
                    autoCropArea: 0.5,

                    // minCropBoxWidth: 256,
                    // minCropBoxHeight: 256,

                    crop: function(data) {
                        // Output the result data for cropping image.
                        // console.log(data);
                        // var smallImage = document.getElementById('smallImage');
                        // smallImage.src = imageURI;

                    }
                });

                // var cdata1 = cont.cropper('getCropBoxData');
                // console.log("cdata1: ", cdata1);
                // var cdata2 = cont.cropper('setCropBoxData', 20, 20, 100, 100);
                // console.log("cdata2: ", cdata2);
                // var cdata3 = cont.cropper('getCropBoxData');
                // console.log("cdata3: ", cdata3);

            }

            // Called when a photo is successfully retrieved
            //
            function onPhotoFileSuccess(imageData) {
                // Get image handle
                console.log("got here file success", imageData)
                console.log(JSON.stringify(imageData));

                // Get image handle
                //
                var smallImage = document.getElementById('smallImage');

                // Unhide image elements
                //
                smallImage.style.display = 'block';

                // Show the captured photo
                // The inline CSS rules are used to resize the image
                //
                smallImage.src = imageData;

                doCropper();
            }

            // Called when a photo is successfully retrieved
            //
            function onPhotoURISuccess(imageURI) {
                // Uncomment to view the image file URI 
                // console.log(imageURI);
                console.log("got here uri success", imageURI)
                console.log(JSON.stringify(imageURI));

                // Get image handle
                //
                var smallImage = document.getElementById('smallImage');

                // Unhide image elements
                //
                smallImage.style.display = 'block';

                // Show the captured photo
                // The inline CSS rules are used to resize the image
                //
                smallImage.src = imageURI;

                doCropper();
            }

            function capturePhotoWithFile(evt) {
                evt.preventDefault();
                console.log("capturePhotoWithFile - doing", evt);

                // Retrieve image file location from specified source
                navigator.camera.getPicture(onPhotoFileSuccess, onFail, {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                });
            }

            function getPhoto(evt, source) {
                evt.preventDefault();
                console.log("getPhoto - doing", evt);
                // Retrieve image file location from specified source

                navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: source
                });
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }

            function captureError(error) {
                var msg = 'An error occurred during capture: ' + error.code;

                function getErrorMessage(CaptureError) {
                    var errorMessage = 'An unknown error occured while trying to get your media, please try again.';
                    switch (CaptureError.code) {
                        case CaptureError.CAPTURE_NOT_SUPPORTED:
                            errorMessage = 'This app does not support the media type.';
                            break;
                        case CaptureError.CAPTURE_NO_MEDIA_FILES:
                            errorMessage = 'No media files returned.';
                            break;
                        case CaptureError.CAPTURE_INTERNAL_ERR:
                            errorMessage = 'The capture process experienced an internal error.';
                            break;
                        case CaptureError.CAPTURE_APPLICATION_BUSY:
                            errorMessage = 'The application was too busy with something else to handle the media capture.';
                            break;
                        case CaptureError.CAPTURE_INVALID_ARGUMENT:
                            errorMessage = 'Values submitted for capture were out of range, notify support.';
                            break;
                        case 3:
                            errorMessage = 'Did you cancel? Please try again.';
                            break;
                        default:
                            break;
                    }
                    return errorMessage;
                }
                navigator.notification.alert(getErrorMessage(error.code), null, 'Uh oh!');
            }


            self.uploadProfileImage = function(image) {
                var setup = self;
                console.log("image: ", image)


                
                return;


            }

            function log(message) {
                console.log("ffmpeg: ", message);
            }





































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


        }
    );
