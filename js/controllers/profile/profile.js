angular.module("SpotJams")

.controller("ProfileController",
    function($scope, $rootScope, $location, $mdToast, profileService) {

        $scope.profile = profileService.get()
        console.log("profile: ", $scope.profile)

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

            $location.path("/profile/setup");
        }

        $scope.gotoFriends = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFriends - doing", event)

            $location.path("/profile/friends");
        }

        $scope.gotoFollows = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoFollows - doing", event)

            $location.path("/profile/follows");
        }

        $scope.gotoTracks = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoTracks - doing", event)

            $location.path("/profile/tracks");
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

        $scope.playeAllTracks = function($event) {
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

    }
);