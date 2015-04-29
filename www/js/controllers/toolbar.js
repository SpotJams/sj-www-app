angular.module('SpotJams')


.controller("BodyController", function($scope, $mdSidenav, profileService) {
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
        var shown = plc.scope().showPlayer
        plc.scope().doShowPlayer(null, !shown);
    };

    self.audioPlayerFull = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        var plc = angular.element($('#playlist-container'))
        plc.scope().doShowList(null, true);
    };

})

.controller("ToolbarController", function($scope, $mdSidenav) {
    var self = this;
    self.toggleLeft = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        $mdSidenav('left').open();
    };
})

.controller('LeftMenuCtrl', function($state, $scope, $mdSidenav, authService) {
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
        $state.go("main")
        $mdSidenav('left').close()
    };
    self.gotoDiscover = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - discover: ");
        $state.go("find_people")
        $mdSidenav('left').close()

    };

    self.gotoMesages = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - messages: ");
        $state.go("messages")
        $mdSidenav('left').close()

    };

    self.gotoFriends = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - friends: ");
        $state.go("profile_friends")
        $mdSidenav('left').close()

    };
    self.gotoTracks = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tracks: ");
        $state.go("profile_tracks")
        $mdSidenav('left').close()

    };
    self.gotoProfile = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - profile: ");
        $state.go("profile_user")
        $mdSidenav('left').close()

    };
    self.gotoTutorials = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tutorials: ");
        $state.go("tutorials")
        $mdSidenav('left').close()

    };
    self.gotoSettings = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - settings: ");
        $state.go("settings")
        $mdSidenav('left').close()

    };
    self.gotoLogout = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - logout: ");

        authService.logout(function success() {
            $state.go("index")
        }, function(error) {
            console.log("failed to logout: ", error);
            alert(error);
        });


        $mdSidenav('left').close()

        // hide menu

    };


});