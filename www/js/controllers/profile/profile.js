angular.module("SpotJams")

.controller("ProfileController",
    function($scope, $rootScope, $state, $mdToast, $timeout, profileService) {

        $scope.profile = $rootScope.profile;
        console.log("ProfileController: ", $scope.profile)
        $rootScope.$on('$stateChangeEnd',
            function(event, toState, toParams, fromState, fromParams){
            $scope.profile = $rootScope.profile;
            console.log("PROFILECONTROLLER: ",$scope.profile, $rootScope.profile);
        });

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