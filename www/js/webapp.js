
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

.run( function($rootScope, $state, $timeout, $q, authService, profileService, playlistService) {

			console.log("Deleting DB")
			// deleteDB();
			// console.log("Migrating DB")
			// migrateDB();
			//
      //       // create root SpotJams folder (should check)
			//   $('.button-collapse').sideNav({
			//       menuWidth: 300, // Default is 240
			//       edge: 'left', // Choose the horizontal origin
			//       closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
			//     }
			//   );
      //       console.log("GOT HERE RUN")
      //       // createRootFolder();
			//
      //       // login with token if existant
      //       authService.loginToken()
      //       .then(function(data) {
	    //         console.log("GOT HEREEE  Logged in: ", authService.uid())
	    //
	    //         $rootScope.$on('$stateChangeStart',
			// 	function(event, toState, toParams, fromState, fromParams){
			//
			// 		var authed = authService.authed();
			// 		if (authed && (toState.name === "login" || toState.name === "register") ) {
			// 			console.log("authed, going to main - ")
			// 		    event.preventDefault();
			// 	    	$state.transitionTo("main")
			// 	    	return;
			// 		}
			//
			// 		if (!authed && !(toState.name === "index" || toState.name === "login" || toState.name === "register")) {
			// 			console.log("authed, going to index - ")
			// 		    event.preventDefault();
			// 	    	$state.transitionTo("index")
			// 	    	return;
		  //           }
	    //         });
	    //
	    //         return authService.uid();
			// })
			//
			// // load the profile and playlist in the background
			// .then(function(uid) {
      //           playlistService.load();
			// 	return profileService.loadSelf();
			// })
			//
			// // set the root scope profile and update the state change handler
			// .then(function(data) {
			// 	console.log("downloaded profiles: ", data)
      //           $rootScope.profile = profileService.get()
      //           console.log(playlistService.get())
      //           if(playlistService.get().length < 1) {
      //           	console.log("empty playlist, adding user tracks")
			//
      //           	var plc = angular.element($('#playlist-container'))
      //               plc.scope().tracks = profileService.get().tracks;
      //               console.log("init playlist", plc.scope().tracks);
			//
      //           	playlistService.addList(profileService.get().tracks);
      //           }
			// })
			// .catch(function(error) {
			// 	console.log("GOT FAILED: ", error)
			// })


			// 	STATE_TIMEOUT = 100;
			// 	COUNT_TIMEOUT = 0;
			// 	if (fromState.name === "" ) {
			// 		STATE_TIMEOUT = 100;
			// 	}

		 //        var goo = function(COUNT) {
			// 		if (!authService.authed() && !okState) {
			// 		    event.preventDefault();
			// 			console.log("GOT HERE RUNNNNNNN", COUNT_TIMEOUT, '\'' + fromState.name + '\'', toState.name)
			//         	if (COUNT > 2000) {
			//         		console.log("BROKE COUNT DURING AUTH")
			// 				if(!okState) {
			// 			    	$state.transitionTo("login")
			// 				}
			// 				return;
			//         	}
			//             var tmp = authService.uid()
			//             if( !tmp ) {
			//             	COUNT += STATE_TIMEOUT;
			//                 $timeout(function() { return goo(COUNT) }, STATE_TIMEOUT);
			//                 return;
			//             }
			// 		} else {
			// 			console.log("goo - Authed!", toState.name)
			// 		    if (toState.name === "login" || toState.name === "register") {

			// 		    }
			// 	    	if (COUNT > 0) {
			// 	    		$state.transitionTo(toState.name, toParams)
			// 	    		return;
			// 	    	}
			// 		}
		 //        }
		 //        goo(0);
			// })


})
