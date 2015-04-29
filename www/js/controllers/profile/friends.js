angular.module("SpotJams")

.controller("FriendListController",
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

            socialService.getFriendList(uid,
                function success(data) {
                    console.log("friend list recvd: ", data);
                    self.data = data;
                }, function(error) {
                    console.log("friend error: ", error)
                });
        };


        init();

    }
);