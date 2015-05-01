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
			_instance._playlist.concat(tracks);
		} else {
			Array.prototype.apply(_instance._playlist, [pos,0].concat(tracks))
		}
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
        var dbP  = loadPlaylistFromDB(uid);
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

        var defer = $q.defer();

        var dbP  = savePlaylistToDB(playlist);
        var srvP = savePlaylistToServer(playlist);

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



    function loadPlaylistFromDB(uid) {
        console.log("loadPlaylistFromDB", uid)
        var defer = $q.defer()
        
        var name = uid + "-playlist"
        var lower = uid + "-playliss"
        var upper = uid + "-playlisu"

        sklad.open(dbName, function(err, conn) {
            if (err) {
                console.log("reject: ", err)
                defer.reject(err);
                return;
            }

            conn.get('user', {
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
                    defer.reject("playlist not found locally");
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
            conn.upsert('user', data, function(err, key) {
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
            conn.delete('user', name, function(err) {
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

    function saveToServer(playlist) {
        console.log("saveToServer")
        var defer = $q.defer();

        $http({
            'method': "POST",
            "url": HOMEBASE + "/api/playlist/" + _instance._playlist.uid,
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