
// var HOMEBASE = "http://api.spotjams.com"
var HOMEBASE = "http://tony.spotjams.com:9090"


angular.module('SpotJams', ['ui.router', 'ngTouch', 'hmTouchEvents', 'angulartics', 'angulartics.scroll', 'angulartics.google.analytics'])

.filter('unsafe', function($sce) { return $sce.trustAsHtml; })
.filter('unsaferesource', function($sce) { return $sce.trustAsResourceUrl; })

.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.withCredentials = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.run( function($rootScope, $state, $timeout, $q, authService, profileService, playlistService, errorReporter) {



			window.onerror = err_reporter;
			
			function err_reporter(message,filename,lineno, colno, error) {
				console.log(filename + "::" + lineno + ":" + colno, message);
				console.log(error);
				errorReporter.reportError(message,filename,lineno, colno, error);			
			}

			if (!window.isMac) {
				// console.log("Deleting DB")
				// deleteDB();
				console.log("Migrating DB")
				migrateDB();
				
			}


			// // init UI elements			
			angular.element($('.button-collapse')).sideNav({
				menuWidth: 240, // Default is 240
				edge: 'left', // Choose the horizontal origin
				closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
			});


            // create root SpotJams folder (should check)
            // createRootFolder();
            console.log("GOT HERE RUN")
			
            // login with token if existant
            authService.loginToken()
            .then(function(data) {
	            console.log("GOT HEREEE  Logged in: ", authService.uid())
	    
	            $rootScope.$on('$stateChangeStart',
				function(event, toState, toParams, fromState, fromParams){
			
					var authed = authService.authed();
					if (authed && (toState.name === "login" || toState.name === "register") ) {
						console.log("authed, going to main - ")
					    event.preventDefault();
				    	$state.transitionTo("main")
				    	return;
					}
			
					if (!authed && !(toState.name === "index" || toState.name === "login" || toState.name === "register")) {
						console.log("authed, going to index - ")
					    event.preventDefault();
				    	$state.transitionTo("index")
				    	return;
		            }
	            });
	    
	            return authService.uid();
			})
			
			.then(function(uid) {
                return playlistService.load();
			})
			// load the profile and playlist in the background
			.then(function() {
                // playlistService.load();
				return profileService.loadSelf();
			})

			
			// set the root scope profile and update the state change handler
			.then(function(data) {
				console.log("downloaded profiles: ", data)
                $rootScope.profile = profileService.get()
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
			})
			.catch(function(error) {
				console.log("GOT FAILED: ", error)
			})

			// var foo = goo;


})

