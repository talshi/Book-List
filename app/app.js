'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.Home',
  'myApp.BookList',
  'myApp.Contact',
  'myApp.version',
  'ngMaterial'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/Home'});
}])
.controller('AppCtrl', ['$scope', '$rootScope', function($scope, $rootScope) {
  $rootScope.currentTab = 'home';

}]);
