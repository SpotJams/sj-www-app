angular.module("SpotJams")

.factory('imageService', function($http, authService) {

    var _image_dir = "SpotJams/images/";

    var _instance = {}
    _instance._image = {}

    /* 
    image = {
        meta: {
            id: 'image id'
            title: 'image name/title',
            description: "This is an image... description [].",
            width: 1024,
            height: 1024,
            imageURL: google link
            thumbURL: google link
            imageFN: local full image filename
            thumbFN: local thumb image filename
        },
        data: blob as base64 encoded,
        thumb: blob as base64 encoded,
    }
    */

    _instance.thumbURL = function(url) {
        if (url) {
            _instance._image.meta.thumbURL = url;
        }
        return _instance._image.meta.thumbURL;
    }

    _instance.imageURL = function(url) {
        if (url) {
            _instance._image.meta.imageURL = url;
        }
        return _instance._image.meta.imageURL;
    }


    _instance.get = function() {
        return _instance._image;
    }

    _instance.set = function(image, filename) {
        _instance._image = image;
        if (filename) {
            _instance._image.meta.imageFN = filename;
            _instance._image.meta.thumbFN = "thumb-" + filename;
        }
        console.log("_instance.set: ", _instance._image)
    }

    _instance.save = function(filename) {
        if (filename) {
            _instance._image.meta.imageFN = filename;
            _instance._image.meta.thumbFN = "thumb-" + filename;
        }
        // saveImageMeta(_instance._image);
        saveImageBlob(_instance._image.meta.imageFN, _instance._image.data, function success(data) {
                console.log("Local Save Profile Image: ", _instance._image);
            },
            function(error) {
                console.log("ERROR Local Save Profile Image: ", error);
            });
        saveImageBlob(_instance._image.meta.thumbFN, _instance._image.thumb, function success(data) {
                console.log("Local Save Profile Thumb: ", _instance._image);
            },
            function(error) {
                console.log("ERROR Local Save Profile Thumb: ", error);
            });
    }

    _instance.download = function(image_id) {

    }

    _instance.upload = function(success_handle,error_handle) {
        console.log("uploading image: ", _instance._image)

        // upload meta & get image ids 

        // (&& eventually get upload urls in return)

        // then save image and thumb data to locally and to GCS


        // But, for now
        // save everything through the API
        // and get the url's in return
        
        uploadToServer(_instance._image,
            function success(data) {
                console.log("Remote Profile Image return: ", data);
                // update image URLs
                _instance._image.meta.imageURL = data.fileURL;
                _instance._image.meta.thumbURL = data.thumbURL;

                // save to file (s)?
                _instance.save();
                success_handle(data);
            },
            function(error) {
                console.log("ERROR Remote Save Profile: ", error);
                error_handle(error);
            });


    }

    function getImageFileEntry(filename, success_handle, error_handle) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, function(error) {
            error_handle(error);
        });

        function onSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;


            directoryEntry.getFile(_image_dir + filename, {
                create: true,
                exclusive: false
            }, function(fileEntry) {
                success_handle(fileEntry);
            }, function(error) {
                error_handle(error);
            });
        }

    }

    function saveImageBlob(filename, image_blob, success_handle, error_handle) {

        getImageFileEntry(filename,
            function(fileEntry) {
                //lets write something into the file
                fileEntry.createWriter(function(writer) {
                    console.log('writing image: ' + filename);
                    
                    var buf = b64toBlob(image_blob, 'image/jpeg');
                    writer.write(buf);
                    console.log('done writing: ' + filename);
                }, function(error) {
                    console.log("Error occurred while writing to file. Error code is: " + error.code);
                    error_handle(error);
                });
            },
            function(error) {
                console.log("Error occurred while getting a pointer to file. Error code is: " + error.code);
                error_handle(error);
            });
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    function uploadToServer(image, success_handle, error_handle) {
        console.log("Saving PROFILE image for: ", authService.uid())

        // image.thumb = b64toBlob(image.thumb, 'image/jpeg');


        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/image/profile/" + authService.uid(),
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
            "data": image,
        })

        .success(function(data, status, headers, config) {
            // console.log(data)
            if (data === undefined || data.error !== undefined) {
                error_handle(data.error);
            } else {
                success_handle(data);
            }
        })

        .error(function(data, status, headers, config) {
            error_handle(data.error);
        })
    }

    return _instance;
})