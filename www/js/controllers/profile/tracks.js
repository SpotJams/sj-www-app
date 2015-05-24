angular.module("SpotJams")

.controller("TracksPageController",
    function($scope, $rootScope, $state, profileService) {

        $scope.pService = profileService
        $scope.$watch('pService.get().uid', function(newVal) {
            console.log("pub profile - uid update: ", newVal)
            if ( newVal !== "" ) {
                $scope.profile = profileService.get()
            }
        })

        $rootScope.tempTitle = "Tracks";
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == "Tracks") {
                $rootScope.tempTitle = "";
            }
        });



        $scope.gotoTrackRecorder = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("gotoTrackRecorder", event)

            $state.go("track_recorder");

        }

    }
);