angular.module("SpotJams")

.controller("PublicProfileController",
    function($scope, $rootScope, $stateParams, $state, authService, profileService, socialService) {
        var self = $scope;
        $scope.profile = {}

        var pub_id = $stateParams.pub_id;
        console.log("ID: ", pub_id);

        // init stuff
        $scope.auth = authService
        $scope.$watch('auth.authed()', function(newVal) {
            console.log("pub profile - authed update: ", newVal)
            if ( newVal === true ) {
                profileService.loadPublic(pub_id)
                .then(function(result) {
                    console.log("pub result: ", result)
                    $scope.profile = result;

                    var uname = result.username;
                    $rootScope.tempTitle = uname;
                    $scope.$on("$destroy", function() {
                        if ($rootScope.tempTitle == uname) {
                            $rootScope.tempTitle = "";
                        }
                    });

                })
                .catch(function(error) {
                    console.log("error loading profile: ", error);
                });
            }
        })

        $scope.gotoFriends = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFriends - doing", event)

            $state.go("user_friends", pub_id);
        }

        $scope.gotoFollows = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFollowings - doing", event)

            $state.go("user_follows", pub_id);
        }

        $scope.gotoTracks = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoTracks - doing", event)

            $state.go("user_tracks", pub_id);
        }


        $scope.sendFriendRequest = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("sending friend request")

            socialService.sendFriendRequest(pub_id,
                function success(data) {
                    Materialize.toast('Friend request sent.', 3000)
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
                    Materialize.toast('Follow request sent.', 3000)

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
            Materialize.toast('Queuing ' + $scope.profile.tracks.length + " tracks.", 3000)

            // $mdToast.show(
            //     $mdToast.simple()
            //     .content('Queuing ' + $scope.profile.tracks.length + " tracks.")
            // );


        }

        $scope.playAllTracks = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("playAllTracks")
            Materialize.toast('Playing ' + $scope.profile.tracks.length + " tracks.", 3000)

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListFrontPlay($scope.profile.tracks);

            // $mdToast.show(
            //     $mdToast.simple()
            //     .content('Playing ' + $scope.profile.tracks.length + " tracks.")
            // );

        }

    });