angular.module("SpotJams")

.controller("TrackRecorderController",
    function($scope, $rootScope, profileService) {

        $scope.pService = profileService
        $scope.$watch('pService.get().uid', function(newVal) {
            console.log("pub profile - uid update: ", newVal)
            if ( newVal !== "" ) {
                $scope.profile = profileService.get()
            }
        })

        $rootScope.tempTitle = "Recorder";
        $scope.$on("$destroy", function() {
            if ($rootScope.tempTitle == "Recorder") {
                $rootScope.tempTitle = "";
            }
        });


        $scope.layers = []

        $scope.addNewLayer = function(event) {
            var pass = spotjams.clickbuster.onClick(event);
            if (!pass) {
                return;
            }
            console.log("Adding new layer")


            var len = $scope.layers.length;
            $scope.layers.push({
                name: "Layer " + len,
            })

        }

    }
);