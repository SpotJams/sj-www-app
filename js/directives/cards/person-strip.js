angular.module("SpotJams")

.directive("personStrip", function() {
    return {
        restrict: 'E',
        templateUrl: "templates/directives/cards/person-strip.html",
        scope: {
            person: "=",
        },
        link: function(scope, element, attrs, parentCtrl) {
            // do init stuff here

            scope.cardHidden = true;

        },
    }
})

.controller("PersonStripController", function($scope,$location) {
    var self = $scope;

    self.showCard = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        self.cardHidden = false;
    }

    self.hideCard = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        self.cardHidden = true;
    }

    self.gotoUser = function(event, uid) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $location.path("/user/" + uid)

    }

})