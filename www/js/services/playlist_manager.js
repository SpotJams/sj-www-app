angular.module("SpotJams")

.factory('playlistService', function($http, $q, authService, profileService) {
	var _instance = {}
	_instance._playlist = [];

	_instance.get = function() {
		return _instance._playlist;
	}

	_instance.add = function(track, pos) {
		if(!pos) {
			_instance._playlist.push(track);
		} else {
			_instance._playlist.splice(pos,0,track);
		}
	}

	_instance.addList = function(tracks, pos) {
		console.log("addList: ", pos, tracks)
		if(!pos) {
            console.log("BEFORE: ", _instance._playlist, tracks);
            
            if (!_instance._playlist) {
                _instance._playlist = [];
            }

            if (_instance._playlist.length < 1 ) {
                _instance._playlist = tracks;
            } else {
                _instance._playlist.concat(tracks);
            }

            console.log("AFTER: ", _instance._playlist);
        } else {
            Array.prototype.apply(_instance._playlist, [pos,0].concat(tracks))
        }
        // console.log("BEFORE: ", _instance._playlist, tracks);
        // Array.prototype.apply(_instance._playlist, [pos,0].concat(tracks))
        // console.log("AFTER: ", _instance._playlist);
	}

	_instance.move = function(last,next) {
		if(!last || !next) {
			console.log("error, positions required for moving")
		} else {
			var track = _instance._playlist[last];
			_instance._playlist.splice(last,1);
			_instance._playlist.splice(next,0,track);
		}
	}

	_instance.remove = function(pos) {
		if(!pos) {
			console.log("error, position required for removing")
		} else {
			_instance._playlist.splice(pos,1);
		}
	}

	_instance.load = function() {
		console.log("loading playlist") 
		var defer = $q.defer()

        var uid = authService.uid()
        var dbP  = loadPlaylist(uid);
        // var srvP = loadPlaylistFromServer(uid);

        $q.all([dbP])
        // $q.all([dbP,srvP])
        .then(function(result) {
            var playlists = [];
            angular.forEach(result, function(response) {
                playlists.push(response);
              });
            _instance._playlist = playlists[0];
            defer.resolve(playlists);
        })
        .catch(function(error) {
            console.log("error loading playlist: ", error);
            defer.reject(error);
        });


        return defer.promise
    }

    _instance.save = function() {
        console.log("Saving user playlist")

        var uid = authService.uid()
        var defer = $q.defer();

        var dbP  = savePlaylist(uid,_instance._playlist);
        var srvP = savePlaylistToServer(uid,_instance._playlist);

        $q.all([dbP,srvP])
        .then(function(result) {
            console.log("playlist saved")
            defer.resolve("success");
        })
        .catch(function(error) {
            console.log("error loading playlist: ", error);
            defer.reject(error);
        });

        return defer.promise;
    }

    function loadPlaylist(uid) {
        console.log("loadPlaylist")

        if( window.isMac ) {
            return loadPlaylistFromFile(uid);
        } else {
            return loadPlaylistFromDB(uid);
        }
    }

    function savePlaylist(uid, playlist) {
        console.log("savePlaylist", playlist)

        if( window.isMac ) {
            return savePlaylistToFile(uid, playlist);
        } else {
            return savePlaylistToDB(uid, playlist);
        }
    }

    function removePlaylist(uid) {
        console.log("removePlaylist")

        if( window.isMac ) {
            return removePlaylistFromFile(uid);
        } else {
            return removePlaylistFromDB(uid);
        }
    }

    function loadPlaylistFromFile(uid) {
        
        var defer = $q.defer();

        var f = function() {
            var playlist = JSON.parse(localStorage.getItem(uid + "-playlist"));
            defer.resolve(playlist);
        }
        
        try {
            console.log("loading playlist form localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise;
    }

    function savePlaylistToFile(uid,playlist) {
        var defer = $q.defer();

        var f = function() {
            localStorage.setItem(uid + "-playlist", JSON.stringify(playlist));
            defer.resolve("success");
        }

        try {
            console.log("saving playlist to localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise
    }

    function removePlaylistFromFile(uid) {
        var defer = $q.defer();
        
        var f = function() {
            localStorage.removeItem(uid + "-playlist");
            defer.resolve("success");
        }

        try {
            console.log("removing playlist form localStorage")
            f();
        } catch(e) {
            defer.reject(e);
        }

        return defer.promise
    }


    function loadPlaylistFromDB(uid) {
        console.log("loadPlaylistFromDB", uid)
        var defer = $q.defer()
        
        var name = uid + "-playlist"
        var lower = uid + "-playliss"
        var upper = uid + "-playlisu"

        sklad.open(dbName, function(err, dbconn) {
            if (err) {
                console.log("reject: ", err)
                defer.reject(err);
                return;
            }

            dbconn.get('user', {
                range: IDBKeyRange.bound(lower, upper, true, true),
                limit: 1,
                direction: sklad.DESC
            }, function(err, records) {
                if (err) {
                    console.log("reject: ", err)
                    defer.reject(err);
                    return;
                }

                if (records.length > 0 && records[0].key && records[0].key == name) {
                    console.log("db resolve playlist");
                    defer.resolve(records[0].value)
                } else {
                    console.log("reject: ", "playlist not found")
                    // defer.reject("playlist not found locally");
                    defer.resolve([]);
                }
            });
        });

        return defer.promise;
    }

    function savePlaylistToDB(uid, playlist) {
        console.log("savePlaylistToDB")
        var defer = $q.defer()

        var name = uid + "-playlist"
        var data = sklad.keyValue(name, playlist);

        sklad.open(dbName, function(err, dbconn) {
            if (err) {
                defer.reject(err);
                return;
            }
            dbconn.upsert('user', data, function(err, key) {
                if (err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve("success: " + key);
            });
        });

        return defer.promise;    
    }

    function removePlaylistFromDB(uid) {
        console.log("removePlaylistFromDB")
        var defer = $q.defer()

        var name = uid + "-playlist"

        sklad.open(dbName, function(err, dbconn) {
            if (err) {
                defer.reject(err);
                return;
            }
            dbconn.delete('user', name, function(err) {
                if (err) {
                    defer.reject(err);
                    return;
                }
                defer.resolve("success");
            });
        });

        return defer.promise;
    }


    function loadPlaylistFromServer(uid) {
        console.log("loadPlaylistFromServer: ", uid)
        var defer = $q.defer()

        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/playlist/" + uid,
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

    function savePlaylistToServer(playlist) {
        console.log("saveToServer")
        var defer = $q.defer();

        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/playlist/" + authService.uid(),
            "data": playlist,
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



	return _instance;
})