angular.module("SpotJams")

.controller("LoginController",
    function($scope, $location, authService, profileService) {

        // var decls
        var self = this;
        self.creds = {};

        // functions
        self.gotoRegister = function(evt) {
            // ngMaterial has issues with multiple click events being fired right now
            evt.preventDefault();
            console.log("gotoRegister - doing", evt)

            $location.path("/register");
        }

        self.tryLogin = function(evt) {
            // ngMaterial has issues with multiple click events being fired right now
            evt.preventDefault();
            console.log("tryLogin - doing", evt)

            // console.log(self.creds)

            // client-side validation
            // ...?

            authService.loginCreds(self.creds.username, self.creds.password,
                function success(data) {
                    console.log("Login success")
                    var profile = data.profile;
                    // compare here?
                    profileService.set(profile);
                    profileService.save();

                    $location.path("/profile/setup?next_page=%2Fmain");
                },
                function(error) {
                    console.log("error logging in: ", error)
                    self.creds.password = ""
                });

        }
    }
);