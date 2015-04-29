angular.module("SpotJams")

.controller("ProfileEditSectionController",
    function($scope, $location, profileService) {

        $scope.adding = false;

        $scope.clicks = []

        $scope.toggleInput = function(open, event, scrollTgt) {
            var pass = spotjams.clickbuster.onClick(event);
            console.log("toggle: ", open, pass, event);
            if (!pass) {
                return;
            }
            $scope.adding = open;
            // if (scrollTgt) {
            //     // $location.hash(scrollTgt);
            //     anchorSmoothScroll.scrollTo(scrollTgt);
            // }
        }
    }
);