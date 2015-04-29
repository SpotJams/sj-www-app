
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
.run( function($rootScope, $state, $timeout, authService, profileService) {

  $('.button-collapse').sideNav({
      menuWidth: 300, // Default is 240
      edge: 'left', // Choose the horizontal origin
      closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
    }
  );


})
//
// .run( function($rootScope, $state, $timeout, authService, profileService) {
//             // create root SpotJams folder (should check)
//             console.log("GOT HERE RUN")
//             // createRootFolder();
//
//             // login with token if existant
//             authService.loginToken(function(data) {
//
//                 console.log("Logged in with: ", data)
//
//                 profileService.uid(authService.uid());
//
//                 // load profile if existant (it should!)
//                 profileService.download(function() {
//                     profileService.save();
//
//                     $rootScope.profile = profileService.get()
// 	            	var plc = angular.element($('#playlist-container'))
//                     plc.scope().tracks = profileService.get().tracks;
//                     console.log("init playlist", plc.scope().tracks);
//                 });
//
//
//             }, function(error) {
//                 console.log("loginToken error: ", error);
//                 $state.go("index")
//             });
//
//
//             TIMEOUT = 100;
// 	        var foo = function() {
// 	            var tmp = profileService.get().uid
// 	            console.log("profile: ", $rootScope.profile)
// 	            if( !tmp ) {
// 	                $timeout(foo, TIMEOUT);
// 	            } else {
// 		            $rootScope.profile = profileService.get()
// 	            	var plc = angular.element($('#playlist-container'))
//                     plc.scope().tracks = profileService.get().tracks;
//                     console.log("init playlist", plc.scope().tracks);
// 	            }
// 	        }
// 	        foo();
//
//
//
//    //          $rootScope.$on('$stateChangeStart',
// 			// function(event, toState, toParams, fromState, fromParams){
// 			// 	var okState = (toState.name === "index" || toState.name === "login" || toState.name === "register")
//
// 			// 	STATE_TIMEOUT = 0;
// 			// 	COUNT_TIMEOUT = 0;
// 			// 	if (fromState.name === "" ) {
// 			// 		STATE_TIMEOUT = 100;
// 			// 	}
//
// 		 //        var goo = function(COUNT) {
// 			// 		if (!authService.authed() && !okState) {
// 			// 		    event.preventDefault();
// 			// 			console.log("GOT HERE RUNNNNNNN", COUNT_TIMEOUT, '\'' + fromState.name + '\'', toState.name)
// 			//         	if (COUNT > 2000) {
// 			//         		console.log("BROKE COUNT DURING AUTH")
// 			// 				if(!okState) {
// 			// 			    	$state.transitionTo("login")
// 			// 				}
// 			// 				return;
// 			//         	}
// 			//             var tmp = authService.uid()
// 			//             if( !tmp ) {
// 			//             	COUNT += STATE_TIMEOUT;
// 			//                 $timeout(function() { return goo(COUNT) }, STATE_TIMEOUT);
// 			//                 return;
// 			//             }
// 			// 		} else {
// 			// 			console.log("goo - Authed!", toState.name)
// 			// 		    if (toState.name === "login" || toState.name === "register") {
// 			// 		    	console.log("goo - ")
// 			// 			    event.preventDefault();
// 			// 		    	$state.transitionTo("main")
// 			// 		    	return;
// 			// 		    }
// 			// 	    	if (COUNT > 0) {
// 			// 	    		$state.transitionTo(toState.name, toParams)
// 			// 	    		return;
// 			// 	    	}
// 			// 		}
// 		 //        }
// 		 //        goo(0);
// 			// })
//
//
// })
//
