angular.module("SpotJams")

.controller("PublicFollowsListController",
    function($scope, $stateParams, socialService) {

        var pub_id = $stateParams.pub_id;
        console.log("ID: ", pub_id);

        var self = $scope;

        function init() {

            socialService.getFollowList(pub_id,
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