/**
 * @author
 * Zhou Hua
 *
 * @date
 * 2015/6/22.
 *
 * @description
 * 本文件提供两个服务，分别是restService和restUrl。
 *
 * restService服务提供与服务器之间的rest接口通信服务，主要处理接口的通用消息规范。
 * restUrl服务提供从资源名称到URI的转换服务，根据运行环境的不同，转换的方式不一样。
 *
 * restUrl服务定义了一个接口函数getUrl，以资源名称为参数，返回URI。
 * 在$rootScope.env没有定义或等于'development'（开发环境）时，getUrl将返回restapp Nodejs Express服务器上的资源地址；
 * 其他情况下，restUrl服务将到$rootScope.restInterfaceUrls对象以资源名称为键名去寻找对应的URI地址。
 * 定义$rootScope.restInterfaceUrls的例子如下：
 *
   ```
     $rootScope.restInterfaceUrls = {
       "index": '/restapi/index',
       "sessions": '/restapi/login',
       "captcha": '/restapi/captcha',
       "users": '/restapi/users',
       ...
     };

   ```
 *
 * restService服务对外提供两个接口和一个全局配置约定：
 *
 * * 两个接口：
 * 1. request：发起一个RESTFul请求，如果返回正常，调用回调函数处理返回结果。
 * 2. promiseRequest：发起一个RESTFul请求，如果返回正常，返回一个promise对象，
 *    该promise对象的then函数可以接受一个回调函数作为参数，回调函数处理返回结果
 *    的回调函数，参数为从服务器返回的JSON数据。支持链式调用。
 *
 * * 一个全局配置：
 * $rootScope.userStatusConf，用于定义处理通用消息规范中userStatus不同状态值的行为。
 * 例子：
   ```
   $rootScope.userStatusConf = {
     'needVerify': {
       'message': '您的手机号或邮箱目前还未验证，需验证之后才能进一步操作！',
       'redirectTo': '/signup2'
     },
     'needExtraInfo': {
       'message': '您的帐户补充信息目前还未提交，需提交之后才能进一步操作！',
       'redirectTo': '/signup3'
     },
     'needApproval': {
       'message': '您的帐户信息目前还在审核中，需审核之后才能进一步操作！',
       'redirectTo': '/login'
     },
     'resubmitExtraInfo': {
       'message': '您需要重新填写账户补充信息!',
       'redirectTo': "/signup3"
     },
     'rejected': {
       'message': '您的帐户信息未通过审核，如有疑问，请联系我们！',
       'redirectTo': '/login'
     },
     'disabled': {
       'message': '您的帐户已经被冻结，如有疑问，请联系我们！',
       'redirectTo': '/login'
     },
     'needLogin': {
       'message': '您正在访问权限受限的页面，需要输入正确的登录信息！',
       'redirectTo': '/login'
     },
     'OK': null  // null means the content of page could be open to the user.
  };
  ```
 *
 */

'user strict';

angular.module('backward')

.factory('restService', ['$q','$resource','$location','$rootScope',function($q, $resource, $location, $rootScope) {
  var restReceive = {
    process: function(res, successFunc) {
      if(res.status == "ERROR") {
        $rootScope.errorTitle = '操作失败！';
        $rootScope.errorMessage = res.message + " [调用编码：" + res.callId + "]";
        $location.path('/error');
        return false;
      } else if (res.status == "SUCCESS" && res.userStatus !== undefined && res.userStatus !== 'OK') {
        var userStatus = res.userStatus;
        if($rootScope.userStatusConf && $rootScope.userStatusConf[userStatus]) {
          var statusConf = $rootScope.userStatusConf[userStatus];
          $rootScope.message = statusConf.message;
          if(res.message) {
            $rootScope.message += "<p>" + res.messsage + "</p>";
          }
          if(statusConf.redirectTo) {
            $location.path(statusConf.redirectTo);
            return false;
          }
        }

        var key = res.result ? res.result.key : null;
        if(key) {
          // set key to cookie, expired after 30 days
          setCookie("key", key, 30);
        }

        if(successFunc) {
          successFunc(res.result);
        } else {
          return res.result;
        }
      }
    },
    processError: function(errorRes, errorFunc) {
      console.log(errorRes);
      if(errorFunc) {
        //@TODO
        errorFunc(errorRes);
      } else {
        $rootScope.errorTitle = '与服务器通信失败！';
        $rootScope.errorMessage = 'status code: ' + errorRes.status + '; Message: ' + errorRes.statusText;
        $location.path('/error');
        return false;
      }
    }
  };

  var setCookie = function(key, value, expireDays) {
    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + expireDays);
    document.cookie = "key=" + value + ";expires=" + expireDate.toGMTString();
  };

  var getCookie = function(key) {
    // get value from cookie
    var value = null;
    if( document.cookie.length > 0 ) {
      var start = document.cookie.indexOf(key + "=");
      if( start != -1 ) {
        start = start + 4;
        var end = document.cookie.indexOf(";", start);
        if (end == -1) {
          end = document.cookie.length;
        }
        value = document.cookie.substring(start, end);
      }
    }
    return value;
  };

  var prepareRequest = function(restUrl, method, data, resourceObj) {
    var methodArray = ['GET', 'DELETE', 'HEAD', 'POST', 'DELETE'];
    var noPayloadMethods = ['GET', 'DELETE', 'HEAD'];
    if(!restUrl || methodArray.indexOf(method) === -1) {
      return null;
    }

    // get key from cookie
    var key = getCookie('key');
    var restParam = {};
    var restData = {};

    if(noPayloadMethods.indexOf(method) !== -1) {
      if(key) {
        restParam.key = key;
      }
      restParam.data = (data === null) ? null : JSON.stringify(data);
    } else {
      if(key) {
        restData.key = key;
      }
      if(data !== null) {
        restData.data = data;
      } else {
        restData = null;
      }
    }

    var restResource = resourceObj(restUrl, {}, {
      action: {
        method: method
      }
    });
    restResource.restData = restData;
    restResource.restParam = restParam;
    return restResource;
  }

  var restService = {
    /**
     * @ngdoc function
     * @name restService.request
     * @module restService
     * @kind function
     *
     * @description
     * 发起一个RESTFul请求，如果返回正常，调用回调函数处理返回结果。
     *
     * 使用例子：
       ```
         var elm = ...;
         var $rootScope = angular.injector(['ng']).get('$rootScope');
         var processFunc = function(result) {
               var captcha = "data:image/png;base64," + result.imageBase64;
               elm.find('img').attr('src', captcha);
               $rootScope.captchaId = result.captchaId;
             }
         restService.request(restUrl.getUrl('captcha'), 'GET', data, processFunc);
       ```
     *
     * @param {String} restUrl 资源URI
     * @param {String} method 请求方法，可以'POST'、'GET'、'PUT'、'DELETE'中的其中之一
     * @param {Object} data 请求中带的数据
     * @param {Function} processFunc 处理返回结果的回调函数，参数为从服务器返回的JSON数据
     * @returns null
     */
    request: function(restUrl, method, data, processFunc) {
      var restResource = prepareRequest(restUrl, method, data, $resource);
      if(!restResource) {
        return;
      }

      var restData = restResource.restData;
      var restParam = restResource.restParam;

      restResource.action(restParam, restData, function(res) {
        restReceive.process(res, processFunc);
      }, function(errorRes) {
        restReceive.processError(errorRes, function(){});
      });
    },

    /**
     * @ngdoc function
     * @name restService.promiseRequest
     * @module restService
     * @kind function
     *
     * @description
     * 发起一个RESTFul请求，如果返回正常，返回一个promise对象，该promise对象的then函数可以接受回调函数作为参数。
     * 该回调函数处理返回结果的回调函数，参数为从服务器返回的JSON数据。
     *
     * 使用例子：
       ```
         var elm = ...;
         var $rootScope = angular.injector(['ng']).get('$rootScope');
         var processFunc = function(result) {
           var captcha = "data:image/png;base64," + result.imageBase64;
           elm.find('img').attr('src', captcha);
           $rootScope.captchaId = result.captchaId;
         }
         restService.promiseRequest(restUrl.getUrl('captcha'), 'GET', data).then(processFunc);
       ```
     *
     * @param {String} restUrl 资源URI
     * @param {String} method 请求方法，可以'POST'、'GET'、'PUT'、'DELETE'中的其中之一
     * @param {Object} data 请求中带的数据
     * @returns null
     */
    promiseRequest: function(restUrl, method, data) {
      var d = $q.defer();
      var restResource = prepareRequest(restUrl, method, data, $resource);
      if(!restResource) {
        return;
      }
      var restData = restResource.restData;
      var restParam = restResource.restParam;

      restResource.action(restParam, restData, function(res) {
        d.resolve(restReceive.process(res));
      }, function(errorRes) {
        d.reject(restReceive.processError(errorRes));
      });
      return d.promise;
    }
  };
  return restService;
}])

.factory('restUrl', ['$location', '$rootScope', function($location, $rootScope) {
  var restUrl = {
    getUrl: function(resourceName) {
      if ( !angular.isDefined($rootScope.env) || $rootScope.env == 'development' ) {
        var baseUrl = '/restapi/';
        return baseUrl + resourceName;
      } else {
        if(!angular.isDefined($rootScope.restInterfaceUrls) || !angular.isDefined($rootScope.restInterfaceUrls[resourceName])) {
          $rootScope.errorMessage = 'The REST interface of \'' + resourceName + '\' is not defined!';
          $location.path('/error');
          return null;
        }
        return $rootScope.restInterfaceUrls[resourceName];
      }
    }
  };
  return restUrl;
}]);