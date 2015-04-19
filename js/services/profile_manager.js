angular.module("SpotJams")

.factory('profileService', function($http, authService) {

    var _filename = "SpotJams/profile.json"

    var _instance = {}
    _instance._profile = {}


    _instance.uid = function(uid) {
    	if(uid) {
    		_instance._profile.uid = uid;
    	}
        return _instance._profile.uid;
    }

    _instance.get = function() {
        return _instance._profile;
    }

    _instance.set = function(profile) {
        _instance._profile = profile;
    }

    _instance.updateDiff = function(profile) {
        // ...?
    }

    _instance.load = function() {
        loadFromFile(function(profile) {
            _instance._profile = profile;
            authService.uid(_instance._profile.uid)

        }, function(error) {
            console.log("error loading profile: ", error);
        });
    }

    _instance.loadFromServerId = loadFromServerId;

    _instance.save = function() {
        

        // TODO check here for server copy last update time newer than local copy


        saveToFile(_instance._profile, function success(data) {
		        console.log("Local Save Profile: ", _instance._profile);
        	},
        	function(error){
		        console.log("ERROR Local Save Profile: ", error);
        	});
    }

    _instance.download = function(success_handle, error_handle) {
        loadFromServer(function(data) {
            _instance._profile = data.profile;
            if (success_handle) {
	            success_handle(data.profile);
            }
        }, function(error) {
            console.log("error downloading profile: ", error);
            if (error_handle){
	            error_handle(error);
            }
        });
    }

    _instance.upload = function(success_handle, error_handle) {
        

        // TODO check here for server copy last update time newer than local copy


    	_instance.save(); // ???
        saveToServer(_instance._profile,
        	function success(data) {
        		// ???? _instance._profile = data.profile;
		        console.log("Remote Save Profile: ", _instance._profile);
        	if (success_handle) {
                success_handle(data);
            }
        },
        	function(error){
		        console.log("ERROR Remote Save Profile: ", error);
         if (error_handle){
                error_handle(error);
            }
           	});
    }

    function getProfileFileEntry(doCreate, success_handle, error_handle) {
        requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, function(error) {
            error_handle(error);
        });

        function onSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;

            directoryEntry.getDirectory("SpotJams", {
                create: true,
                exclusive: false
            }, function() {}, function(error) {
                error_handle(error);
            })

            directoryEntry.getFile(_filename, {
                create: doCreate,
                exclusive: false
            }, function(fileEntry) {
                success_handle(fileEntry);
            }, function(error) {
                error_handle(error);
            });
        }
    }

    function loadFromFile(success_handle, error_handle) {
        getProfileFileEntry(false, function(fileEntry) {

            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    var profile_str = evt.target.result;
                    profile = angular.fromJson(profile_str);
                    console.log("User Profile: ", profile)
                    success_handle(profile);
                };
                reader.readAsText(file);

            }, function(error) {
                error_handle(error);
            });
        }, function(error) {
            error_handle(error);
        });
    }

    function saveToFile(profile, success_handle, error_handle) {
        getProfileFileEntry(true, 
        	function success(fileEntry) {
                fileEntry.createWriter(function(writer) {
                    pretty = angular.toJson(profile, true);
                    writer.write(pretty);
                }, function(error) {
                    return error;
                });

            },
            function(error) {
                console.log("Error occurred while opening profile. Error code is: " + error.code);
            });
    }

    function loadFromServer(success_handle, error_handle) {
        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/profile/" + _instance._profile.uid,
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

    function loadFromServerId(id,success_handle, error_handle) {
        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/user/profile/" + id,
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

    function saveToServer(profile, success_handle, error_handle) {

        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/profile/" + _instance._profile.uid,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
            "data": profile,
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

    function CompareVersions() {

    }


    return _instance;
});