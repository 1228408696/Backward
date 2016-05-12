'use strict';

angular.module('frontierApp.error', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/error', {
      templateUrl: '/components/core/error.html',
      controller: 'ErrorController'
    })
}])

.controller('ErrorController', function($rootScope, $scope, $resource, $location, restUrl, restService) {
  $rootScope.errorMessage = $rootScope.errorMessage || 'Unknown error!';
});

angular.module('frontierApp.version', [
  'frontierApp.version.interpolate-filter',
  'frontierApp.version.version-directive'
])

.value('version', '0.1');
