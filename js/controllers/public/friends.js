angular.module("SpotJams")

.controller("PublicFriendListController",
    function($scope, $routeParams, socialService) {

        var pub_id = $routeParams.pub_id;
        console.log("ID: ", pub_id);

        var self = $scope;

        function init() {

            socialService.getFriendList(pub_id,
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