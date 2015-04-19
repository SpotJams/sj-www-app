angular.module("SpotJams")

.controller("FindPeopleListController",
    function($scope, $rootScope, $location, $http, authService) {

        // TODO make backup?
        $rootScope.tempTitle = "SpotJammers"
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == "SpotJammers") {
                $rootScope.tempTitle = "";
            }
        });

        if (!$scope.people) {
            $scope.people = [];
        }       

        $scope.gotoPerson = function(pub_id) {
            console.log("going to see: ", pub_id);
            $location.path("/user/" + pub_id);
        }

        console.log("token: ", authService.token() )

        $http({
            'method': "GET",
            "url": HOMEBASE + "/api/briefs",
            'headers': {
                'Authorization': 'Bearer ' + authService.token(),
            },
        })

        .success(function(data, status, headers, config) {
            // console.log(data)
            if (data === undefined || data.error !== undefined) {
                console.log("error: ", data.error);
                alert("error: " + data.error);
            } else {
                $scope.people = data;
                console.log("Loaded: ", $scope.people);

                // HACK to refresh ui
            }
        })

        .error(function(data, status, headers, config) {
            console.log("error:", data);
            alert("server error");
        })
    }
);