angular.module('SpotJams')


.controller("BodyController", function($scope, authService, profileService) {
    var self = this;

    self.showTitleBar = false;

    $scope.auth = authService
    $scope.$watch('auth.authed()', function(newVal) {
        console.log("authed update: ", newVal)
        self.showTitleBar = newVal;
    })

    self.leftMenuSlide = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        console.log("LHS menu");

        var lhm = angular.element($('.button-collapse'))
        lhm.sideNav('show')
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

.controller('LeftMenuCtrl', function($state, $scope, authService) {
    var self = this;
    self.closeLeft = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }

        closeLeftMenu();
    };

    self.gotoHome = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - home: ");
        $state.go("main")

        closeLeftMenu();
    };
    self.gotoDiscover = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - discover: ");
        $state.go("find_people")

        closeLeftMenu();

    };

    self.gotoMessages = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - messages: ");
        $state.go("messages")

        closeLeftMenu();

    };

    self.gotoFriends = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - friends: ");
        $state.go("profile_friends")

        closeLeftMenu();

    };
    self.gotoTracks = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tracks: ");
        $state.go("profile_tracks")

        closeLeftMenu();

    };
    self.gotoProfile = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - profile: ");
        $state.go("profile_user")

        closeLeftMenu();

    };
    self.gotoTutorials = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - tutorials: ");
        $state.go("tutorials")

        closeLeftMenu();

    };
    self.gotoSettings = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - settings: ");
        $state.go("settings")

        closeLeftMenu();

    };
    self.gotoLogout = function(event) {
        var pass = spotjams.clickbuster.onClick(event);
        if (!pass) {
            return;
        }
        console.log("leftmenu - logout: ");

        authService.logout(function success() {
            console.log("logout success")
            $state.go("index")
        }, function(error) {
            console.log("failed to logout: ", error);
            alert(error);
        });

        $state.go("index")


        closeLeftMenu();

        // hide menu

    };

    function closeLeftMenu() {
        var lhm = angular.element($('.button-collapse'))
        lhm.sideNav('hide')
    }


});
