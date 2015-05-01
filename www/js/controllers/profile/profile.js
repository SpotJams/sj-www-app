angular.module("SpotJams")

.controller("ProfileController",
    function($scope, $rootScope, $state, $timeout, profileService) {

        // This is to wait on the load of the profile if this is the first page we visit
        console.log("ProfileController: ", $scope.profile)
        var tmp = profileService.get().uid
        if (tmp == undefined) {
            var TIMEOUT = 100;
            var foo = function() {
                var tmp = profileService.get().uid
                console.log("profile: ", $scope.profile)
                if( !tmp ) {
                    $timeout(foo, TIMEOUT);
                } else {
                    $scope.profile = profileService.get()
                }
            }
            foo();
        } else {
            $scope.profile = profileService.get();
        }

        $rootScope.tempTitle = "Profile";
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == "Profile") {
                $rootScope.tempTitle = "";
            }
        });

        $scope.gotoEditProfile = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoEditProfile - doing", event)

            $state.go("profile_setup");
        }

        $scope.gotoFriends = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFriends - doing", event)

            $state.go("profile_friends");
        }

        $scope.gotoFollows = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFollows - doing", event)

            $state.go("profile_follows");
        }

        $scope.gotoTracks = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoTracks - doing", event)

            $state.go("profile_tracks");
        }

        $scope.queueAllTracks = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("queueAllTracks")

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListBack($scope.profile.tracks);

            // $mdToast.show(
            //     $mdToast.simple()
            //     .content('Queuing ' + $scope.profile.tracks.length + " tracks.")
            // );
        }

        $scope.playeAllTracks = function($event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }

            console.log("playAllTracks")

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListFrontPlay($scope.profile.tracks);

            // $mdToast.show(
            //     $mdToast.simple()
            //     .content('Playing ' + $scope.profile.tracks.length + " tracks.")
            // );
        }

    }
);