angular.module("SpotJams")

.controller("LoginController",
    function($rootScope, $scope, $state, authService, profileService, playlistService) {

        // var decls
        var self = this;
        self.creds = {};

        // functions
        self.gotoRegister = function(evt) {
            // ngMaterial has issues with multiple click events being fired right now
            evt.preventDefault();
            console.log("gotoRegister - doing", evt)

            $state.go("register");
        }

        self.tryLogin = function(evt) {
            // ngMaterial has issues with multiple click events being fired right now
            evt.preventDefault();
            console.log("tryLogin - doing", evt)

            // client-side validation
            // ...?

            authService.loginCreds(self.creds.username, self.creds.password)
            .then(
                function success(data) {
                    console.log("Login success", profile)
                    var profile = data.profile;
                    // compare here?
                    profileService.set(profile);
                    profileService.save();
                    playlistService.load();


                    $rootScope.profile = profile; 

                    var pl = playlistService.get();
                    console.log(pl)
                    if(pl == null || pl.length < 1) {
                        console.log("empty playlist, adding user tracks")
                
                        var plc = angular.element($('#playlist-container'))
                        plc.scope().tracks = profileService.get().tracks;
                        console.log("init playlist", plc.scope().tracks);
                
                        playlistService.addList(profileService.get().tracks);
                        playlistService.save()
                    }

                    $state.go("main");
                },
                function(error) {
                    console.log("error logging in: ", error)
                    self.creds.password = ""
                });

        }
    }
);