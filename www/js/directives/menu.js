angular.module('SpotJams', ['ngTouch'])
    .directive('mySlideController', ['$swipe',
        function($swipe) {
            return {
                restrict: 'EA',
                link: function(scope, ele, attrs, ctrl) {
                    var startX, pointX;
                    $swipe.bind(ele, {
                        'start': function(coords) {
                            startX = coords.x;
                            pointX = coords.y;
                        },
                        'move': function(coords) {
                            var delta = coords.x - pointX;
                            // ...
                        },
                        'end': function(coords) {
                            // ...
                        },
                        'cancel': function(coords) {
                            // ...
                        }
                    });
                }
            }
        }
    ]);

// .directive("menu", function() {
//     return {
//         restrict: "E",
//         template: "<div ng-class='{ show: visible, left: alignment === \"left\", right: alignment === \"right\" }' ng-transclude></div>",
//         transclude: true,
//         scope: {
//             visible: "=",
//             alignment: "@"
//         }
//     };
// })
// .directive("menuItem", function() {
//      return {
//          restrict: "E",
//          template: "<div ng-click='navigate()' ng-transclude></div>",
//          transclude: true,
//          scope: {
//              hash: "@"
//          },
//          link: function($scope) {
//              $scope.navigate = function() {
//                  window.location.hash = $scope.hash;
//              }
//          }
//      }
// });