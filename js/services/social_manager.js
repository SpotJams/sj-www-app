angular.module("SpotJams")

.factory('socialService', function($http, authService) {

    var _instance = {}
    _instance._profile = {}



    _instance.sendFriendRequest = function(uid, success_handle, error_handle) {
	    $http({
            'method': "POST",
            "url": HOMEBASE + "/api/friend/" + uid,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
        })

        .success(function(data, status, headers, config) {
            if (data === undefined || data.error !== undefined) {
            	error_handle(data.error);
            } else {
            	success_handle(data);
            }
        })

        .error(function(data, status, headers, config) {
        	error_handle(data);
        })

    }

    _instance.sendFollowRequest = function(uid, success_handle, error_handle) {
	    $http({
            'method': "POST",
            "url": HOMEBASE + "/api/follow/" + uid,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
        })

        .success(function(data, status, headers, config) {
            if (data === undefined || data.error !== undefined) {
            	error_handle(data.error);
            } else {
            	success_handle(data);
            }
        })

        .error(function(data, status, headers, config) {
        	error_handle(data);
        })

    }

    _instance.getFriendList = function(uid, success_handle,error_handle) {
        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/friend/" + uid,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
        })

        .success(function(data, status, headers, config) {
            if (data === undefined || data.error !== undefined) {
            	error_handle(data.error);
            } else {
            	success_handle(data);
            }
        })

        .error(function(data, status, headers, config) {
        	error_handle(data);
        })
    }


    _instance.getFollowList = function(uid, success_handle,error_handle) {
        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/follow/" + uid,
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
        })

        .success(function(data, status, headers, config) {
            if (data === undefined || data.error !== undefined) {
            	error_handle(data.error);
            } else {
            	success_handle(data);
            }
        })

        .error(function(data, status, headers, config) {
        	error_handle(data);
        })
    }


    
    return _instance;

})