angular.module("SpotJams")

.controller("PublicProfileController",
    function($scope, $rootScope, $routeParams, $location, $mdToast, profileService, socialService) {
        var self = $scope;

        var pub_id = $routeParams.pub_id;
        console.log("ID: ", pub_id);

        profileService.loadFromServerId(pub_id,
            function success(data) {
                console.log("public data: ", data);
                $scope.profile = data;
                console.log("public profile: ", $scope.profile);

                $rootScope.tempTitle = $scope.profile.username
                $scope.$on("$destroy", function() {
                    if ($rootScope.tempTitle == $scope.profile.username) {
                        $rootScope.tempTitle = "";
                    }
                });

            },
            function(error) {
                console.log("error getting public profile: ", error);
            }
        )

        $scope.gotoFriends = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFriends - doing", event)

            $location.path("/user/friends/" + pub_id);
        }

        $scope.gotoFollows = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFollowings - doing", event)

            $location.path("/user/follows/" + pub_id);
        }

        $scope.gotoTracks = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoTracks - doing", event)

            $location.path("/user/tracks/" + pub_id);
        }


        $scope.sendFriendRequest = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("sending friend request")

            socialService.sendFriendRequest(pub_id,
                function success(data) {
                    alert("friend request sent")
                    console.log("friend request sent: ", data);
                },
                function(error) {
                    console.log("friend err: ", error)
                })

        }


        $scope.sendFollowRequest = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("sending follow request")

            socialService.sendFollowRequest(pub_id,
                function success(data) {
                    alert("follow request sent")
                    console.log("follow request sent: ", data);
                },
                function(error) {
                    console.log("follow err: ", error)
                })
        }


        $scope.queueAllTracks = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("queueAllTracks")

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListBack($scope.profile.tracks);

            $mdToast.show(
                $mdToast.simple()
                .content('Queuing ' + $scope.profile.tracks.length + " tracks.")
            );


        }

        $scope.playAllTracks = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("playAllTracks")

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListFrontPlay($scope.profile.tracks);

            $mdToast.show(
                $mdToast.simple()
                .content('Playing ' + $scope.profile.tracks.length + " tracks.")
            );

        }

    });