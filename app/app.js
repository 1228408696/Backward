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












    // ����У��
    /*$rootScope.regularList = {
      //�ֻ�����У��
      telphone: /^1[34578]\d{9}$/,
      //����У��
      email: /^[a-z0-9A-Z]+([-|_|\.]+[a-z0-9A-Z]+)*@([a-z0-9A-Z]+[-|\.])+[a-zA-Z]{2,5}$/,
      //ע������У��
      password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/,
      //password: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$){6,16}$/,
      // ��֤��У��
      code: /^[0-9]{6}$/,
      // ���֤
      idCard: /^(([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{4})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|(X|x))))$/,
      ipv4: /^((([01]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))[.]){3}(([0-1]?[0-9]{1,2})|(2[0-4][0-9])|(25[0-5]))$/,
      //��������˺ţ�phone or email
      account: /^1[34578]\d{9}$|^([a-z0-9A-Z]+[-|_|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/,
      //���ֵУ��
      quota: /^\+?[1-9]\d*$/,
      //Ӫҵִ��У��
      businessLicense: /^(\d{13}|\d{15}|\d{20}|\d{22}|\d{24})$/,
      //��֯��������֤У��
      organizationCode: /^(\d{8}\-\d)$/,
      //��ҵ��λ���˵Ǽ�֤��У��
      institution: /^\d{12}$/,
      //������巨�˵Ǽ�֤��У��
      socialGroup: /(^\d{9}$)|(^(\d{8}\-\d)$)/,
      //��ʵ����У�飬���������ַ�
      personName: /[\d|A-z|\u4E00-\u9FFF]/
    };*/

  }]);