angular.module("SpotJams")

.controller("ProfileController",
    function($scope, $rootScope, $state, $timeout, profileService) {

        $scope.pService = profileService
        $scope.$watch('pService.get().uid', function(newVal) {
            console.log("pub profile - uid update: ", newVal)
            if ( newVal !== "" ) {
                $scope.profile = profileService.get()
            }
        })

        console.log("ProfileController: ", $scope.profile)
        $rootScope.tempTitle = "Your Profile";
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == "Your Profile") {
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
            Materialize.toast('Queuing ' + $scope.profile.tracks.length + " tracks.", 3000)

            var plc = angular.element($('#playlist-container'))
            plc.scope().addTrackListBack($scope.profile.tracks);


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

    }
);