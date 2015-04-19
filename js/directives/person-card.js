angular.module("SpotJams")
    .controller("PersonCardController", ["$rootScope", "$scope", "$location",
        function($rootScope, $scope, $location) {
            console.log("profile: ", $rootScope.profile)
            $scope.profile = $rootScope.profile
        }
    ])
    .directive('personCard',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'templates/directives/person-card.html',
            }
        }
    );