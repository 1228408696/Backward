'use strict';

angular.module('frontierApp.skeleton', ['ngRoute', 'ngResource'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/skeleton', {
      templateUrl: 'modules/skeleton/skeleton_view.html',
      controller: 'SkeletonController'
    })
    .when('/skeleton2', {
      templateUrl: 'modules/login/skeleton_view.html',
      controller: 'SkeletonController'
    });
}])

.controller('SkeletonController', function($rootScope, $scope, $resource, $location, restUrl, restService) {
  $scope.login = function() {
    var data = {
      username: $scope.username,
      password: $scope.password
    };
    var processFunc = function(result) {
      if(result === false) {
        return;
      }
      console.log(result);
      var key = result.key;

      // set key to cookie, expired after 30 days
      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 30); //expired after 30 days
      document.cookie = "key=" + key + ";expires=" + expireDate.toGMTString();

      $rootScope.message = "Your are now logged in!";
      $location.path('/skeleton');
    };

    restService.promiseRequest(restUrl.getUrl('login'), 'POST', data).then(processFunc);
  };
  $scope.username = "cmss_user";
  $scope.password = "password";
});