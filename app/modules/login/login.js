'use strict';

angular.module('backward.login', ['ui.router', 'ngMessages', 'ngCookies'])

  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'modules/login/login_view.html',
        controller: 'loginController'
      })
  }])

  .controller('loginController',['$rootScope', '$scope', function ($rootScope, $scope) {

  }]);