angular.module("SpotJams")

.controller("FollowsListController",
    function($scope, $rootScope, profileService, socialService) {

        $scope.profile = profileService.get()
        console.log("profile: ", $scope.profile)

        $rootScope.tempTitle = $scope.profile.username;
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == $scope.profile.username) {
                $rootScope.tempTitle = "";
            }
        });

        var uid = $scope.profile.uid;

        var self = $scope;
        function init() {

            socialService.getFollowList(uid,
                function success(data) {
                    console.log("followings list recvd: ", data);
                    self.data = data;
                }, function(error) {
                    console.log("followings error: ", error)
                });
        };


        init();

    }
);