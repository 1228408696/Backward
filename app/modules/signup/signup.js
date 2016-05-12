'use strict';

angular.module('backward.signup', ['ui.router', 'ngMessages', 'ngResource', 'ngCookies'])

  .config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('signup', {
        url: '/signup',
        templateUrl: 'modules/signup/signup_view.html',
        controller: 'signupController'
      })
  }])

  .controller('signupController', ['$rootScope', '$scope', 'restUrl', 'restService', function ($rootScope, $scope, restUrl, restService) {

    $scope.signup = function () {
      if ($scope.password !== $scope.password2) {
        alert("两次输入的密码不一致！");
        return;
      }
      var data = {
        username: $scope.username,
        password: $scope.password,
        captcha: $scope.captcha
      };
      var processFunc = function (result) {
        console.log(result);

        $rootScope.message = "欢迎, " + result.username + "! 您现在已经成功登录系统!";
        $location.path('/account');
      };
      restService.promiseRequest(restUrl.getUrl('users'), 'POST', data).then(processFunc);
    };

    $scope.checkUsername = function () {
      if (!$scope.username) {
        alert("请输入用户名！");
        return;
      }
      var data = {
        username: $scope.username,
        action: "check-username"
      }
      var processFunc = function (result) {
        console.log(result);
        if (!result) {
          alert("用户名可用!");
        } else {
          alert("用户名不可用!");
        }
      }
      restService.promiseRequest(restUrl.getUrl('users'), 'GET', data).then(processFunc);
    };

  }]);