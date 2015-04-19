angular.module("SpotJams")

.factory("trackService", function($http, authService) {

    var _track_dir = "SpotJams/tracks/";

    var _instance = {}
    _instance._track = {}

    /* 
    track = {
        meta: {
            id: 'image id',
            trackId: 'track id',
            userId: 'user id',
            
			trackFN: localFN,
            trackURI: google link,

            title: 'image name/title',
            description: "This is an image... description [].",
            length: float, // in seconds
            size: int, // in bits

			instruments: [],
			genres: [],
			artists: [],

        },
        data: blob as base64 encoded,
    }
    */

    _instance.trackURL = function(url) {
        if (url) {
            _instance._track.meta.trackURL = url;
        }
        return _instance._track.meta.trackURL;
    }

    _instance.get = function() {
        return _instance._track;
    }

    _instance.set = function(track, filename) {
        _instance._track = track;
        if (filename) {
            _instance._track.meta.trackFN = filename;
        }
        console.log("_instance.set: ", _instance._track)
    }

    _instance.getMeta = function() {
        return _instance._track.meta;
    }

	_instance.setMeta = function(meta) {
        _instance._track.meta = meta;
        console.log("_instance.setMeta: ", _instance._track)
    }

    _instance.loadMeta = function(filename,success_handle,error_handle) {
    	loadTrackMeta(filename,function(meta_data) {
    		_instance._track.meta = meta_data
    		success_handle(_instance._track.meta);
    	}, error_handle);

    }

    _instance.downloadMeta = function(track_id,success_handle,error_handle) {
    	downloadMetaFromServerId(track_id,function(meta_data) {
    		_instance._track.meta = meta_data
    		success_handle(_instance._track.meta);
    	}, error_handle);

    }

    _instance.saveMeta = function(success_handle,error_handle) {
    	var meta = _instance._track.meta;
    	var fn = "meta-" +  meta.title + ".txt";
    	console.log("saveMeta(): ", fn, meta);

    	if( !success_handle )
    		success_handle = function() {}
    	if( !error_handle )
    		error_handle = function(error) {}

    	saveTrackMeta(fn, meta, success_handle, error_handle);
    }

    _instance.uploadMeta = function(success_handle,error_handle) {
        console.log("uploading track: ", _instance._track)

        // upload meta & get relavent ids 
        uploadToServer(_instance._track.meta,
            function success(data) {
                console.log("Remote Track meta upload return: ", data);
                // update image URLs
                _instance._track.meta.trackId = data.trackId;
                _instance._track.meta.uploadURL = data.uploadURL;

                // save updates to file
                _instance.saveMeta();
                success_handle(data);
            },
            function(error) {
                console.log("ERROR Remote track meta upload: ", error);
                error_handle(error);
            });

        // upload track data to GCS


        // notify SJ server of status

    }

    _instance.upload = function(success_handle,error_handle) {
        console.log("uploading track: ", _instance._track)

        // upload meta & get relavent ids 
        uploadToServer(_instance._track,
            function success(data) {
                console.log("Remote Track meta upload return: ", data);
                // update image URLs
                _instance._track.meta.trackId = data.trackId;
                _instance._track.meta.uploadURL = data.uploadURL;

                // save updates to file
                _instance.saveMeta();
                success_handle(data);
            },
            function(error) {
                console.log("ERROR Remote track meta upload: ", error);
                error_handle(error);
            });

        // upload track data to GCS


        // notify SJ server of status

    }


    _instance.getFile = function(success_handle,error_handle) {
    	getTrackFileEntry(_instance._track.meta.trackFN,success_handle,error_handle)
    }

    function getTrackFileEntry(filename, success_handle, error_handle) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, function(error) {
            error_handle(error);
        });

        function onSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;


            directoryEntry.getFile(_track_dir + filename, {
                create: true,
                exclusive: false
            }, function(fileEntry) {
                success_handle(fileEntry);
            }, function(error) {
                error_handle(error);
            });
        }
    }

    function loadTrackMeta(filename, success_handle, error_handle) {
    	// open metadata
    	var track_meta = {}
        getTrackFileEntry(filename, function(fileEntry) {

            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    var meta_str = evt.target.result;
                    track_meta = angular.fromJson(meta_str);
                    console.log("Track Meta: ", track_meta)
                    success_handle(track_meta);
                };
                reader.readAsText(file);

            }, function(error) {
                error_handle(error);
            });
        }, function(error) {
            error_handle(error);
        });
    }

    function saveTrackMeta(filename, track_meta, success_handle, error_handle) {
    	console.log("saveTrackMeta(): ", filename, track_meta);
        getTrackFileEntry(filename,
            function(fileEntry) {
                //lets write something into the file
                fileEntry.createWriter(function(writer) {
                    pretty = angular.toJson(track_meta, true);
                    writer.write(pretty);
                    success_handle();
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

    function uploadToServer(track_data, success_handle, error_handle) {
        console.log("Uploading track_data for: ", authService.uid(), track_data)
        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/track/" + authService.uid(),
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
            "data": track_data,
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

    function downloadMetaFromServerId(id,success_handle, error_handle) {
        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/track/" + id,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
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

