angular.module("SpotJams")

.factory('authService', function($http) {

    var _filename = "SpotJams/token.txt"

    var _instance = {}
    _instance._authed = false;
    _instance._token = null;
    _instance._uid = ""

    _instance.authed = function() {
        return _instance._authed;
    }

    _instance.token = function() {
        return _instance._token;
    }

    _instance.uid = function(id) {
        if (id) {
            _instance._uid = id;
        }
        return _instance._uid;
    }

    _instance.loadToken = function(success_handle, error_handle) {
        console.log("loginToken")
        loadTokenFromDB(function(token) {
            console.log("loadToken ret: ",token);
            _instance._token = token; // set the current token to the one we just read
            $http.defaults.headers.common.Authorization = "Bearer " + token;
            success_handle(token);
        }, error_handle);
    }

    _instance.loginToken = function(success_handle, error_handle) {
        console.log("loginToken")
        loadTokenFromDB(function(token) {
            console.log("loadToken ret: ",token);
            _instance._token = token; // set the current token to the one we just read
            $http.defaults.headers.common.Authorization = "Bearer " + token;

            // also need to send the device information too
            checkTokenWithServer(token, success_handle, error_handle); // verify
        }, error_handle);
    }

    _instance.loginCreds = function(username, password, success_handle, error_handle) {
        $http({
                'method': "POST",
                'url': HOMEBASE + "/auth/login",

                // also need to send the device information too
                'data': JSON.stringify({
                    'username': username,
                    'password': password
                }),
            })
            .success(function(data, status, headers, config) {
                // console.log(data)
                if (data === undefined || data.error !== undefined) {

                    _instance._token = null;
                    _instance._authed = false;

                    error_handle(data.error);
                } else {

                    _instance._uid = data.uid,
                    _instance._token = data.token;
                    _instance._authed = true;
                    $http.defaults.headers.common.Authorization = "Bearer " + data.token;

                    saveTokenToDB(_instance._token, function(data) {
                        console.log("saveToken ret:", data);
                    });
                    success_handle(data);
                }
            })
            .error(function(data, status, headers, config) {
                _instance._token = null;
                _instance._authed = false;

                error_handle(data.error);
            })

    }

    _instance.logout = function(success_handle, error_handle) {
        // TODO make http request to remove server side token
        delete $http.defaults.headers.common.Authorization;
        removeTokenFromDB(success_handle, error_handle);
    }

    _instance.register = function(details, success_handle, error_handle) {
        $http({
                'method': "POST",
                'url': HOMEBASE + "/auth/register",
                'data': JSON.stringify(details),
            })
            .success(function(data, status, headers, config) {
                // console.log(data)
                if (data === undefined || data.error !== undefined) {
                    error_handle(data.error);
                } else {

                    _instance._token = data.token;
                    _instance._authed = true;
                    $http.defaults.headers.common.Authorization = "Bearer " + data.token;

                    // TODO fix this so that the coken has a shorter life
                    // and the have N (3 days?) to verify their account
                    // via an email

                    saveTokenToDB(_instance._token, function(data) {
                        console.log("saveToken ret:", data);
                    });
                    success_handle(data);
                }
            })
            .error(function(data, status, headers, config) {
                error_handle(data.error);
            })
    }

    function checkTokenWithServer(token, success_handle, error_handle) {
        // console.log("Checking token: ", token)

        $http({
                'method': "GET",
                'url': HOMEBASE + "/api/auth_test",
                // 'headers': {
                //     'Authorization': 'Bearer ' + token,
                // },
            })
            .success(function(data, status, headers, config) {
                console.log(data)
                if (data === undefined || data.error !== undefined) {

                    // destroy token file?
                    _instance._token = null;
                    _instance._authed = false;

                    error_handle(data.error);
                } else {
                    console.log(data);
                    _instance._uid = data.authed;
                    _instance._authed = true;
                    // _instance._token = token;  // incase we decide to update server side
                    success_handle(data);
                }
            })
            .error(function(data, status, headers, config) {
                // destroy token file?
                _instance._token = null;
                _instance._authed = false;

                error_handle(data.error);
            })

    }

    function getTokenFileEntry(doCreate, success_handle, error_handle) {
        navigator.webkitPersistentStorage.requestQuota( 1 * 1024, function(grantedBytes) {
            window.requestFileSystem(PERSISTENT, grantedBytes, onSuccess, function(error) {
                console.log("Error occurred during request to file system pointer. Error code is: ", error);
            });
        }, function(e) {
            console.log('Error', e);
        });

        function onSuccess(fileSystem) {
            var directoryEntry = fileSystem.root;

            directoryEntry.getDirectory("SpotJams", {
                create: false,
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

    function loadTokenFromFile(success_handle, error_handle) {
        getTokenFileEntry(false, function(fileEntry) {

            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    var token = evt.target.result;
                    // console.log("User Token: ", token)
                    success_handle(token);
                };
                reader.readAsText(file);

            }, function(error) {
                error_handle(error);
            });
        }, function(error) {
            error_handle(error);
        });

    }

    function saveTokenToFile(token, success_handle, error_handle) {
        getTokenFileEntry(true, function(fileEntry) {

            fileEntry.file(function(file) {

                fileEntry.createWriter(function(writer) {
                    writer.write(token);
                    success_handle(token);
                }, function(error) {
                    error_handle(error);
                });

            }, function(error) {
                error_handle(error);
            });
        }, function(error) {
            error_handle(error);
        });
    }

    function removeTokenFile(success_handle, error_handle) {
        getTokenFileEntry(true, function(fileEntry) {

            fileEntry.file(function(file) {

                fileEntry.remove(function(stuff) {
                    console.log("Logout succeeded", stuff)
                    success_handle(stuff);
                }, function(error) {
                    error_handle(error);
                });

            }, function(error) {
                error_handle(error);
            });
        }, function(error) {
            error_handle(error);
        });
    }

    function loadTokenFromDB(success_handle, error_handle) {
        // var name = _instance._uid + "-token"
        var name = "token"

        console.log("loadTokenFromDB", name)

        // DBCONN.get('user', {direction: sklad.DESC, limit: 10, offset: 5}, function(data) {
        //     console.log("GOT HERE DBCONN RET", data)
        // });

        sklad.open(dbName, function (err, database) {
            database.get('user', {
                range: IDBKeyRange.bound('tokem', 'tokeo', true, true),
                limit: 1,
                direction: sklad.DESC
            }, function (err, records) {
                if (err) {
                    // check err.name to get the reason of error
                    // err.message will also be useful
                    error_handle(err)
                }

                console.log(records)

                if (records.length > 0 && records[0].key && records[0].key == "token") {
                    success_handle(records[0].value)
                } else {
                    error_handle({"error": "token not found locally"})
                }

                // records in an array containing objects with structure:
                // {
                //     key: ...,
                //     value: object1
                // },
                // ...
            });
        });
    }

    function saveTokenToDB(token, success_handle, error_handle) {
        // var name = _instance._uid + "-token"
        console.log("saveTokenToDB", token)
        var name = "token"
        var data = sklad.keyValue(name, token);
        DBCONN.upsert('user', data, success_handle);
    }

    function removeTokenFromDB(success_handle, error_handle) {
        // var name = _instance._uid + "-token"
        var name = "token"
        DBCONN.delete('user', name, success_handle);
    }

    return _instance;
});