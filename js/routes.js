angular.module('SpotJams')
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {

            $routeProvider.


            // AUTH related
            when('/', {
                templateUrl: 'templates/pages/index.html'
            }).
            when('/login', {
                templateUrl: 'templates/pages/auth/login.html'
            }).
            when('/register', {
                templateUrl: 'templates/pages/auth/register.html'
            }).


            // MAIN page
            when('/main', {
                templateUrl: 'templates/pages/main.html'
            }).



            // FIND pages
            when('/find', {
                templateUrl: 'templates/pages/find/index.html'
            }).
            when('/find/people', {
                templateUrl: 'templates/pages/find/people.html'
            }).
            
            when('/find/match', {
                templateUrl: 'templates/pages/find/match.html'
            }).
            when('/find/search', {
                templateUrl: 'templates/pages/find/search.html'
            }).
            when('/find/music', {
                templateUrl: 'templates/pages/find/music.html'
            }).
            when('/find/lessons', {
                templateUrl: 'templates/pages/find/lessons.html'
            }).
            when('/find/places', {
                templateUrl: 'templates/pages/find/places.html'
            }).
            when('/find/events', {
                templateUrl: 'templates/pages/find/events.html'
            }).



            // VJAMS pages
            when('/vjams', {
                templateUrl: 'templates/pages/vjams/index.html'
            }).
            when('/vjams/tracks', {
                templateUrl: 'templates/pages/vjams/tracks.html'
            }).
            when('/vjams/compositions', {
                templateUrl: 'templates/pages/vjams/compositions.html'
            }).
            when('/vjams/messages', {
                templateUrl: 'templates/pages/vjams/messages.html'
            }).
            when('/vjams/add', {
                templateUrl: 'templates/pages/vjams/add.html'
            }).



            // COMMUNITY pages
            when('/community', {
                templateUrl: 'templates/pages/community/index.html'
            }).
            when('/community/groups', {
                templateUrl: 'templates/pages/community/groups.html'
            }).
            when('/community/bands', {
                templateUrl: 'templates/pages/community/bands.html'
            }).
            when('/community/places', {
                templateUrl: 'templates/pages/community/places.html'
            }).
            when('/community/events', {
                templateUrl: 'templates/pages/community/events.html'
            }).
            when('/community/messages', {
                templateUrl: 'templates/pages/community/messages.html'
            }).
            when('/community/forums', {
                templateUrl: 'templates/pages/community/forums.html'
            }).


            // PUBLIC VIEWS of users
            when('/user/:pub_id', {
                templateUrl: 'templates/pages/public/profile.html'
            }).
            when('/user/friends/:pub_id', {
                templateUrl: 'templates/pages/public/friends.html'
            }).
            when('/user/follows/:pub_id', {
                templateUrl: 'templates/pages/public/follows.html'
            }).
            when('/user/tracks/:pub_id', {
                templateUrl: 'templates/pages/public/tracks.html'
            }).

            // PROFILE / PRIVATE VIEW pages
            when('/profile/user', {
                templateUrl: 'templates/pages/profile/profile.html'
            }).
            when('/profile/edit', {
                templateUrl: 'templates/pages/profile/edit.html'
            }).
            when('/profile/card', {
                templateUrl: 'templates/pages/profile/card.html'
            }).
            when('/profile/tracks', {
                templateUrl: 'templates/pages/profile/tracks.html'
            }).
            when('/profile/feed', {
                templateUrl: 'templates/pages/profile/feed.html'
            }).
            when('/profile/setup', {
                templateUrl: 'templates/pages/profile/setup.html'
            }).
            when('/profile/friends', {
                templateUrl: 'templates/pages/profile/friends.html'
            }).
            when('/profile/follows', {
                templateUrl: 'templates/pages/profile/follows.html'
            }).



            // ASSETS pages
            when('/instrument/:id', {
                templateUrl: 'templates/pages/assets/instrument.html'
            }).
            when('/track/:id', {
                templateUrl: 'templates/pages/assets/track.html'
            }).
            when('/group/:id', {
                templateUrl: 'templates/pages/assets/group.html'
            }).


            // UTILS
            when('/settings', {
                templateUrl: 'templates/pages/utils/settings.html'
            }).


            // TUTORIALS

            // introductory tutorials
            when('/tutorials', {
                templateUrl: 'templates/pages/intro/intro1.html'
            }).

            // introductory tutorials
            when('/intro1', {
                templateUrl: 'templates/pages/intro/intro1.html'
            }).
            when('/intro2', {
                templateUrl: 'templates/pages/intro/intro2.html'
            }).
            when('/intro3', {
                templateUrl: 'templates/pages/intro/intro3.html'
            }).



            otherwise({
                redirectTo: '/main'
            });
        }
    ])
