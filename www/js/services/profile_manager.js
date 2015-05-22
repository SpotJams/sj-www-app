angular.module("SpotJams")

.factory('profileService', function($http, $q, authService) {

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

    _instance.loadSelf = function() {
        var defer = $q.defer();

        var uid = authService.uid()
        var dbP  = loadProfile(uid);


        dbP.then(function success(result) {
            console.log("found profile locally", result)    
            _instance._profile = result;
            defer.resolve(_instance._profile);
   
        }, function(error) {
            console.log("profile missing locally", error)
        })

        // TODO eventually we only want to do this if there are updates pending from the server side
        var srvP = loadPrivateProfileFromServer(uid);
        srvP.then(function success(result) {
            console.log("found profile remotely", result) 

            if (!_instance._profile || !_instance._profile.uid) {
                _instance._profile = result.profile;
                
                // TODO this returns a promise, should handle success / error events
                _instance.save();
            }
            defer.resolve(_instance._profile);

            // TODO check last modified dates, server should almost always be correct

        }, function(error) {
            console.log("profile missing remotely", error)
            defer.reject(error);
        })

        return defer.promise
    }

    _instance.loadPublic = function(uid) {
        console.log("LOADING USER PROFILE")
        var defer = $q.defer();

        var dbP  = loadProfile(uid);
        var srvP = loadPublicProfileFromServer(uid);

        $q.all([dbP,srvP])
        .then(function(result) {
            var profiles = [];
            angular.forEach(result, function(response) {
                profiles.push(response);
              });


            /// TODO check profile last updated times and do appropriate shit
            _instance._profile = profiles[0];
            defer.resolve(profiles);
        })
        .catch(function(error) {
            console.log("error loading profile: ", error);
            defer.reject(error);
        });

        return defer.promise
    }

    _instance.save = function() {
        console.log("Saving user profile")

        var defer = $q.defer();

        var profile = _instance._profile;

        var dbP  = saveProfile(profile);
        var srvP = saveProfileToServer(profile);

        $q.all([dbP,srvP])
        .then(function(result) {
            console.log("profile saved")
            defer.resolve("success")
        })
        .catch(function(error) {
            console.log("error loading profile: ", error);
            defer.reject(error);
        });

        return defer.promise;
    }


    function loadProfile(uid) {
        console.log("loadProfile")

        if( window.isMac ) {
            return loadProfileFromFile(uid);
        } else {
            return loadProfileFromDB(uid);
        }
    }

    function saveProfile(profile) {
        console.log("saveProfile", profile)

        if( window.isMac ) {
            return saveProfileToFile(profile);
        } else {
            return saveProfileToDB(profile);
        }
    }

    function removeProfile(uid) {
        console.log("removeProfile")

        if( window.isMac ) {
            return removeProfileFromFile(uid);
        } else {
            return removeProfileFromDB(uid);
        }
    }





    function loadPublicProfileFromServer(id) {
        console.log("loadFromServerId: ", id)
        var defer = $q.defer()

        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/user/profile/" + id,
        })

        .success(function(data, status, headers, config) {
            // console.log(data)
            if (data === undefined || data.error !== undefined) {
                defer.reject(data.error);
            } else {
                defer.resolve(data);
            }
        })

        .error(function(data, status, headers, config) {
            defer.reject(data.error);
        })

        return defer.promise
    }

    function loadPrivateProfileFromServer(id) {
        console.log("loadProfileFromServer: ", id)
        var defer = $q.defer()

        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/profile/" + id,
        })

        .success(function(data, status, headers, config) {
            // console.log(data)
            if (data === undefined || data.error !== undefined) {
                defer.reject(data.error);
            } else {
                defer.resolve(data);
            }
        })

        .error(function(data, status, headers, config) {
            defer.reject(data.error);
        })

        return defer.promise
    }

    function saveProfileToServer(profile) {
        console.log("saveProfileToServer")
        var defer = $q.defer();

        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/profile/" + _instance._profile.uid,
            "data": profile,
        })

        .success(function(data, status, headers, config) {
            // console.log(data)
            if (data === undefined || data.error !== undefined) {
                defer.reject(data.error);
            } else {
                defer.resolve(data);
            }
        })

        .error(function(data, status, headers, config) {
            defer.reject(data.error);
        })

        return defer.promise
    }


    function loadProfileFromFile(uid) {
        
        var defer = $q.defer();

        var f = function() {
            var profile = JSON.parse(localStorage.getItem(uid + "-profile"));
            defer.resolve(profile);
        }
        
        try {
            console.log("loading profile form localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise;
    }

    function saveProfileToFile(profile) {
        var defer = $q.defer();

        var f = function() {
            localStorage.setItem(profile.uid + "-profile", JSON.stringify(profile));
            defer.resolve("success");
        }

        try {
            console.log("saving profile to localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise
    }

    function removeProfileFromFile(uid) {
        var defer = $q.defer();
        
        var f = function() {
            localStorage.removeItem(uid + "-profile");
            defer.resolve("success");
        }

        try {
            console.log("removing profile form localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise
    }


    function loadProfileFromDB(uid) {
        console.log("loadProfileFromDB", uid)
        var defer = $q.defer()
        
        var name = uid + "-profile"
        var lower = uid + "-profild"
        var upper = uid + "-profilf"

        sklad.open(dbName, function(err, conn) {
            if (err) {
                console.log("reject: ", err)
                defer.reject(err);
            }

            conn.get('user', {
                range: IDBKeyRange.bound(lower, upper, true, true),
                limit: 1,
                direction: sklad.DESC
            }, function(err, records) {
                if (err) {
                    console.log("reject: ", err)
                    defer.reject(err);
                    return
                }

                if (records.length > 0 && records[0].key && records[0].key == name) {
                    console.log("db resolve profile");
                    defer.resolve(records[0].value)
                } else {
                    console.log("reject: ", "profile not found")
                    defer.reject("profile not found locally");
                }
            });
        });

        return defer.promise;
    }

    function saveProfileToDB(profile) {
        console.log("saveProfileToDB")
        var defer = $q.defer()

        var name = _instance._profile.uid + "-profile"
        var data = sklad.keyValue(name, profile);

        sklad.open(dbName, function(err, conn) {
            if (err) {
                defer.reject(err);
            }
            conn.upsert('user', data, function(err, key) {
                if (err) {
                    defer.reject(err);
                }
                defer.resolve("success: " + key);
            });
        });

        return defer.promise;    
    }

    function removeProfileFromDB(uid) {
        console.log("removeProfileFromDB")
        var defer = $q.defer()

        var name = uid + "-profile"

        sklad.open(dbName, function(err, conn) {
            if (err) {
                defer.reject(err);
            }
            conn.delete('user', name, function(err) {
                if (err) {
                    defer.reject(err);
                }
                defer.resolve("success");
            });
        });

        return defer.promise;
    }


    return _instance;
});