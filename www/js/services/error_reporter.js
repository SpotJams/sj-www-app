angular.module("SpotJams")

.factory('errorReporter', function($q, $http) {

    var _instance = {}
    _instance._profile = {}


    _instance.reportError = function(message,filename,lineno, colno, error) {
        console.log("reportError")
        var defer = $q.defer();

        $http({
                'method': "POST",
                'url': HOMEBASE + "/auth/jserr",

                // also need to send the device information too
                'data': JSON.stringify({
                    'message': message,
                    'filename': filename,
                    'lineno': lineno,
                    'colno': colno,
                    'error': JSON.stringify(error),
                    // 'stack': error.stack? JSON.stringify(error.stack) : "no stack",
                }),
            })
            .success(function(data, status, headers, config) {
                console.log(data)
                if (data === undefined || data.error !== undefined) {
                    defer.reject(data.error);
                } else {
	                console.log("error reporter SUCCESS!!!")
                    defer.resolve(data);
                }
            })
            .error(function(data, status, headers, config) {
                console.log("error reporter error!!!")
                defer.reject(data.error);
            })

        return defer.promise

    }



    
    return _instance;

})