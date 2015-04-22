angular.module('SpotJams')
    .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

            $urlRouterProvider.otherwise('/');

            $stateProvider


            // AUTH related
            .state('index',{
                url: '/',
                templateUrl: 'templates/pages/index.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/pages/auth/login.html'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'templates/pages/auth/register.html'
            })


            // MAIN page
            .state('main', {
                url: '/main',
                templateUrl: 'templates/pages/main.html'
            })



            // FIND pages
            .state('find', {
                url: '/find',
                templateUrl: 'templates/pages/find/index.html'
            })
            .state('find_people', {
                url: '/find/people',
                templateUrl: 'templates/pages/find/people.html'
            })
            
            .state('find_match', {
                url: '/find/match',
                templateUrl: 'templates/pages/find/match.html'
            })
            .state('find_search', {
                url: '/find/search',
                templateUrl: 'templates/pages/find/search.html'
            })
            .state('find_music', {
                url: '/find/music',
                templateUrl: 'templates/pages/find/music.html'
            })
            .state('find_lessons', {
                url: '/find/lessons',
                templateUrl: 'templates/pages/find/lessons.html'
            })
            .state('find_places', {
                url: '/find/places',
                templateUrl: 'templates/pages/find/places.html'
            })
            .state('find_events', {
                url: '/find/events',
                templateUrl: 'templates/pages/find/events.html'
            })



            // VJAMS pages
            .state('vjams', {
                url: '/vjams',
                templateUrl: 'templates/pages/vjams/index.html'
            })
            .state('vjams_tracks', {
                url: '/vjams/tracks',
                templateUrl: 'templates/pages/vjams/tracks.html'
            })
            .state('vjams_compositions', {
                url: '/vjams/compositions',
                templateUrl: 'templates/pages/vjams/compositions.html'
            })
            .state('vjams_messages', {
                url: '/vjams/messages',
                templateUrl: 'templates/pages/vjams/messages.html'
            })
            .state('vjams_add', {
                url: '/vjams/add',
                templateUrl: 'templates/pages/vjams/add.html'
            })



            // COMMUNITY pages
            .state('community', {
                url: '/community',
                templateUrl: 'templates/pages/community/index.html'
            })
            .state('community_groups', {
                url: '/community/groups',
                templateUrl: 'templates/pages/community/groups.html'
            })
            .state('community_bands', {
                url: '/community/bands',
                templateUrl: 'templates/pages/community/bands.html'
            })
            .state('community_places', {
                url: '/community/places',
                templateUrl: 'templates/pages/community/places.html'
            })
            .state('community_events', {
                url: '/community/events',
                templateUrl: 'templates/pages/community/events.html'
            })
            .state('community_messages', {
                url: '/community/messages',
                templateUrl: 'templates/pages/community/messages.html'
            })
            .state('community_forums', {
                url: '/community/forums',
                templateUrl: 'templates/pages/community/forums.html'
            })


            // PUBLIC VIEWS of users
            .state('user', {
                url: '/user/:pub_id',
                templateUrl: 'templates/pages/public/profile.html'
            })
            .state('user_friends', {
                url: '/user/friends/:pub_id',
                templateUrl: 'templates/pages/public/friends.html'
            })
            .state('user_follows', {
                url: '/user/follows/:pub_id',
                templateUrl: 'templates/pages/public/follows.html'
            })
            .state('user_tracks', {
                url: '/user/tracks/:pub_id',
                templateUrl: 'templates/pages/public/tracks.html'
            })

            // PROFILE / PRIVATE VIEW pages
            .state('profile_user', {
                url: '/profile/user',
                templateUrl: 'templates/pages/profile/profile.html'
            })
            .state('profile_edit', {
                url: '/profile/edit',
                templateUrl: 'templates/pages/profile/edit.html'
            })
            .state('profile_card', {
                url: '/profile/card',
                templateUrl: 'templates/pages/profile/card.html'
            })
            .state('profile_tracks', {
                url: '/profile/tracks',
                templateUrl: 'templates/pages/profile/tracks.html'
            })
            .state('profile_feed', {
                url: '/profile/feed',
                templateUrl: 'templates/pages/profile/feed.html'
            })
            .state('profile_setup', {
                url: '/profile/setup',
                templateUrl: 'templates/pages/profile/setup.html'
            })
            .state('profile_friends', {
                url: '/profile/friends',
                templateUrl: 'templates/pages/profile/friends.html'
            })
            .state('profile_follows', {
                url: '/profile/follows',
                templateUrl: 'templates/pages/profile/follows.html'
            })



            // ASSETS pages
            .state('instrument', {
                url: '/instrument/:id',
                templateUrl: 'templates/pages/assets/instrument.html'
            })
            .state('track', {
                url: '/track/:id',
                templateUrl: 'templates/pages/assets/track.html'
            })
            .state('group', {
                url: '/group/:id',
                templateUrl: 'templates/pages/assets/group.html'
            })


            // UTILS
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/pages/utils/settings.html'
            })


            // TUTORIALS

            // introductory tutorials
            .state('tutorials', {
                url: '/tutorials',
                templateUrl: 'templates/pages/intro/intro1.html'
            })

            // introductory tutorials
            .state('intro1', {
                url: '/intro1',
                templateUrl: 'templates/pages/intro/intro1.html'
            })
            .state('intro2', {
                url: '/intro2',
                templateUrl: 'templates/pages/intro/intro2.html'
            })
            .state('intro3', {
                url: '/intro3',
                templateUrl: 'templates/pages/intro/intro3.html'
            })

        }
    ])
