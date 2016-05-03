 'use strict';

 angular.module('backward.signup', ['ui.router', 'ngMessages', 'ngCookies'])

   .config(['$stateProvider', function ($stateProvider) {
     $stateProvider
       .state('signup', {
         url: '/signup',
         templateUrl: 'modules/signup/signup_view.html',
         controller: 'signupController'
       })
   }])

   .controller('signupController',['$rootScope', '$scope', function ($rootScope, $scope) {

   }]);