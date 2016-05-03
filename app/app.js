'use strict';

angular.module('backward', [
  'ui.router',
  'backward.index',
  'backward.login',
  'backward.signup'
])
 /* .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/index'});
  }])*/
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

    $urlRouterProvider.otherwise('/index');
  }])

  .controller('rootController', ['$rootScope', '$scope', function ($rootScope, $scope) {












    // 正则校验
    /*$rootScope.regularList = {
      //手机号码校验
      telphone: /^1[34578]\d{9}$/,
      //邮箱校验
      email: /^[a-z0-9A-Z]+([-|_|\.]+[a-z0-9A-Z]+)*@([a-z0-9A-Z]+[-|\.])+[a-zA-Z]{2,5}$/,
      //注册密码校验
      password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      //password: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$){6,16}$/,
      // 验证码校验
      code: /^[0-9]{6}$/,
      // 身份证
      idCard: /^(([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))))$/,
      ipv4: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
      //合作伙伴账号，phone or email
      account: /^1[34578]\d{9}$|^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
      //配额值校验
      quota: /^\+?[1-9]\d*$/,
      //营业执照校验
      businessLicense: /^(\d{13}|\d{15}|\d{20}|\d{22}|\d{24})$/,
      //组织机构代码证校验
      organizationCode: /^(\d{8}\-\d)$/,
      //事业单位法人登记证书校验
      institution: /^\d{12}$/,
      //社会团体法人登记证书校验
      socialGroup: /(^\d{9}$)|(^(\d{8}\-\d)$)/,
      //真实姓名校验，不是特殊字符
      personName: /[\d|A-z|\u4E00-\u9FFF]/
    };*/

  }]);