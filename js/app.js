
var HOMEBASE = "http://spotjams.com:9090"
// var HOMEBASE = "http://spotjams-api.appspot.com"


angular.module('SpotJams', ['ngRoute', 'ngMaterial', 'ngTouch', 'hmTouchEvents', 'angulartics', 'angulartics.scroll', 'angulartics.google.analytics'])

.filter('unsafe', function($sce) { return $sce.trustAsHtml; })
.filter('unsaferesource', function($sce) { return $sce.trustAsResourceUrl; })

.config(function ( $httpProvider) {        
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

