angular.module("SpotJams")
    .controller("ProfileCardController", ["$rootScope", "$scope", "$location",
        function($rootScope, $scope, $location) {

            console.log("profile: ", $rootScope.profile)
                // $scope.profile = $rootScope.profile

            $scope.profile = {}

            $scope.refresh = function (prof) {
            	$scope.profile = prof;
            }

            $scope.tryLoad = function() {
                var loaded = $scope;

                console.log("TRYLOADING:", loaded.profile)

                var success = function(data) {
                    console.log("INCOMING DATA: ", data);

                    if (data.error !== undefined) {
                        console.log("error: ", data.error);
                        alert("error: " + data.error);
                        return;
                    } else {

                        console.log("Loaded: ", data.profile);

                        $scope.refresh(data.profile);

                        console.log("userid: ", $rootScope.userid);
                        console.log("profile: ", $rootScope.profile);
                        console.log("loadedd: ", loaded.profile);

                        return
                    }
                }

                $.ajax({
                        "type": "GET",
                        beforeSend: function(request) {
                            request.setRequestHeader('Authorization', 'Bearer ' + $rootScope.token)
                        },
                        "crossDomain": true,
                        "url": HOMEBASE + "/api/profile/" + $rootScope.userid,
                        'contentType': 'application/json',
                        "dataType": "json",
                        "success": success,
                    })
                    .fail(function(data) {
                        console.log("error:", data);
                        alert("server error");
                        return;
                    })




                return;
            }

        }
    ]);