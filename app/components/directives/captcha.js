/**
 * Created by zhouhua
 * @date 2015/07/14
 *
 * @description
 * 验证码指令，封装了验证码控件，该控件由验证码图片、验证码输入框以及检查结果三部分组成。
 *
 * 本验证码指令使用了两个约定的Restful API接口，一个是创建captcha的接口，另一个是检验captcha的接口：
 *
 *
 * @example
 * 使用方法有两种，一种是使用captcha自定义标签，另一种是使用captcha自定义属性，例如:
 *
   ```
     <captcha captcha-model="captchaOfScope"></captcha>
   ```
 *
 * 或
 *
   ```
     <div captcha captcha-model="captchaOfScope"></div>
   ```
 *
 * `captcha-model`是一个桥接模型，用于关联本指令外部变量和内部变量。
 * 上述例子当中，captchaOfScope是在当前控制器下$scope的一个成员变量，该成员变量是一个JSON对象，名称可以任意指定。
 *
 * 结构和初始值应该设置为：
 *
   ```
   $scope.captchaOfScope = {
     input: "",
     checkResult: null,
     createCaptcha: null,
     checkCaptcha: null,
     captchaId: null,
     beforeCheckCaptcha: function() { ... },
     afterCheckCaptcha: function() { ... },
   }
   ```
 *
 * input: 如果input的初始值为非空字符串，则本指令初始化时，captcha的输入框将自动设置为该值。每次进行验证码检验时，input将被自动设置为captcha的输入框当前的内容。
 * checkResult: 每次进行验证码检验时，checkResult则被设置为远程检查captcha是否输入正确的布尔值，正确为true，不正确为false，没有检查过为null。
 * createCaptcha: 指令初始化后，该变量被自动设置为一个无参数的函数，调用该函数将创建新的验证码。
 * checkCaptcha: 指令初始化后，该变量被自动设置为一个无参数的函数，调用该函数将检查输入的验证码是否正确。
 * captchaId: 从服务器获取验证码后，该变量会自动设置为验证码的ID。
 * beforeCheckCaptcha: 当检查验证码开始之前调用该函数。
 * afterChackCaptcha: 当检查验证码结束时调用该函数。
 *
 * captcha指令的html对象由验证码图片、验证码输入框以及检查结果三部分组成，这三部分html对象的css都可以定制：
 *
 * .captcha-img是验证码图片的css类；
 * .captcha-input是验证码输入框的css类；
 * .captcha-check-none是没有检查过验证码时检查结果的css类；
 * .captcha-check-ok是最近一次检查验证码时检查正确情况下检查结果的css类；
 * .captcha-check-failed是最近一次检查验证码时检查不正确情况下检查结果的css类；
 *
 * 完整的例子如下:
 *
   ```
     <body ng-app="frontierApp" ng-controller="RootController">
       <div ng-controller="CaptchaController">
         <style type="text/css">
           .captcha-img {width: 50px; height: 32px;}
           .captcha-input {width: 100px; height: 32px;}
           .captcha-check-none {display: inline-block;width: 32px; height: 32px;}
           .captcha-check-ok {display: inline-block;width: 32px; height: 32px;background-repeat: no-repeat;background-image: url("../../assets/images/correct.png");}
           .captcha-check-failed {display: inline-block;width: 32px; height: 32px;background-repeat: no-repeat;background-image: url("../../assets/images/error.png");}
         </style>
         <div class="form-item"><div captcha captcha-model="formCaptcha"></div></div>
         <div class="form-item"><button ng-click="submit()">Submit</button></div>
       </div>

       <script src="../../bower_components/angular/angular.js"></script>
       <script src="../../bower_components/angular-route/angular-route.js"></script>
       <script src="../../bower_components/angular-resource/angular-resource.js"></script>
       <script type="text/javascript">
         angular.module('frontierApp', [
           'ngRoute',
           'frontierApp.captcha',
           'frontierApp.captchaExample']
         ).controller('RootController', function($rootScope, $scope) {

         });
         angular.module("frontierApp.captchaExample", [
           'ngResource']
         ).controller("CaptchaController", function ($rootScope, $scope) {
           $scope.submit = function() {
             if($scope.formCaptcha.checkResult !== true) {
               alert("Your captcha input " + $scope.formCaptcha.input + " is not correct!");
             } else {
               alert("Your captcha input " + $scope.formCaptcha.input + " will be submitted!");
             }
           }
         });
       </script>
       <script src="../../components/services/rest_service.js"></script>
       <script src="../../components/directives/captcha.js"></script>
     </body>
   ```
 */

'use strict';

angular.module('frontierApp.captcha', [])

  .directive('captcha', ["restService", "restUrl", "$rootScope", function(restService, restUrl, $rootScope) {
    var captchaId = null;
    var thisScope = null;
    var thisElm = null;

    var createCaptcha = function() {
      var data = null;
      var processFunc = function(result) {
        var captcha = "data:image/png;base64," + result.imageBase64;
        thisElm.find('img').attr('src', captcha);
        captchaId = result.captchaId;
        thisScope.captchaModel.captchaId = captchaId;
        thisScope.captchaModel.checkResult = false;
      };
      restService.promiseRequest(restUrl.getUrl('captcha'), 'POST', data).then(processFunc);
    };

    var checkCaptcha = function() {
      thisScope.captchaModel.checkResult = false;
      if(thisScope.captchaModel.beforeCheckCaptcha && typeof(thisScope.captchaModel.beforeCheckCaptcha) === 'function') {
        thisScope.captchaModel.beforeCheckCaptcha();
      }
      var data = {
        "captchaId": captchaId,
        "captchaCode": thisElm.find('input').val()
      };
      var processFunc = function(result) {
        if(result === null) {
          // captcha not found
          thisElm.find('div').removeClass('captcha-check-none').removeClass('captcha-check-ok').addClass('captcha-check-failed');
          thisScope.captchaModel.checkResult = false;
        } else {
          // captcha found, check ok
          thisElm.find('div').removeClass('captcha-check-none').removeClass('captcha-check-failed').addClass('captcha-check-ok');
          thisScope.captchaModel.checkResult = true;
        }
        if(thisScope.captchaModel.afterCheckCaptcha && typeof(thisScope.captchaModel.afterCheckCaptcha) === 'function') {
          thisScope.captchaModel.afterCheckCaptcha();
        }
      };
      restService.promiseRequest(restUrl.getUrl('captcha'), 'GET', data).then(processFunc);
    }

    return {
      "restrict": "EA",
      "scope": {
        "captchaModel": '='
      },
      "link": function (scope, elm, attrs) {
        elm.find('img').on('click', function(event){
          createCaptcha();
        });
        createCaptcha();
        elm.find('input').on('blur', function(event){
          checkCaptcha();
        });
        if(scope.captchaModel === undefined) {
          scope.captchaModel = {};
        }
        thisScope = scope;
        thisElm = elm;
        scope.captchaModel.createCaptcha = createCaptcha;
        scope.captchaModel.checkCaptcha = checkCaptcha;
      },
      "template": "<img class=\"captcha-img\" src=\"\" /><input class=\"captcha-input\" style=\"width: 100px;\" name=\"captcha\" ng-model=\"captchaModel.input\" /><div class=\"captcha-check-none\"></div>"
    };
  }]);
