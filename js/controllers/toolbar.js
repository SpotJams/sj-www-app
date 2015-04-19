angular.module('SpotJams')


.controller("BodyController", function($location, $scope, $mdSidenav, profileService) {
    var self = this;

    self.leftMenuSlide = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $mdSidenav('left').open();
    };

    self.audioPlayerSlide = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        var plc = angular.element($('#playlist-container'))
        plc.scope().doShowPlayer(true);
    };

})

.controller("ToolbarController", function($location, $scope, $mdSidenav) {
    var self = this;
    self.toggleLeft = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $mdSidenav('left').open();
    };
})

.controller('LeftMenuCtrl', function($location, $scope, $mdSidenav, authService) {
    var self = this;
    self.closeLeft = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        $mdSidenav('left').close()
    };

    self.gotoHome = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - home: ");
        $location.path("/main")
        $mdSidenav('left').close()
    };
    self.gotoDiscover = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - discover: ");
        $location.path("/find/people")
        $mdSidenav('left').close()

    };

    self.gotoMesages = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - messages: ");
        $location.path("/messages")
        $mdSidenav('left').close()

    };

    self.gotoFriends = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - friends: ");
        $location.path("/profile/friends")
        $mdSidenav('left').close()

    };
    self.gotoTracks = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tracks: ");
        $location.path("/profile/tracks")
        $mdSidenav('left').close()

    };
    self.gotoProfile = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - profile: ");
        $location.path("/profile/user")
        $mdSidenav('left').close()

    };
    self.gotoTutorials = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tutorials: ");
        $location.path("/tutorials")
        $mdSidenav('left').close()

    };
    self.gotoSettings = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - settings: ");
        $location.path("/settings")
        $mdSidenav('left').close()

    };
    self.gotoLogout = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - logout: ");

        authService.logout(function success() {
            $location.path("/")
        }, function(error) {
            console.log("failed to logout: ", error);
            alert(error);
        });

        $mdSidenav('left').close()

        // hide menu

    };


});