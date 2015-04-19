angular.module("SpotJams")
    .controller("IndexCardController", ["$rootScope", "$scope", "$location",
        function($rootScope, $scope, $location) {
            console.log("profile: ", $rootScope.profile)
            $scope.profile = $rootScope.profile
        }
    ])
    .directive('indexCard',
        function() {
            return {
                restrict: 'E',
                templateUrl: 'templates/directives/person-card.html',
            }
        }
    );