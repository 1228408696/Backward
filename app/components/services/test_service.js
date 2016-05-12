/**
 * @author
 * Zhou Hua
 *
 * @date
 * 2015/9/6.
 *
 * @description
 * 定义testService，封装$httpBackend，为需要进行restful接口请求的单元测试的提供两种测试接口：
 * 1. 模拟请求和响应公共服务接口：testService.simulateRequest，可模拟从发送请求到接受请求处理的完整的restful接口。
 * 调用此接口后，服务将在$rootScope中添加一个名字为frontierTest的JSON变量，其中的成员testResult记录了从模拟服务器返回JSON对象的result数据。
 * 2. 设置请求预期的服务接口：testService.expectRequest及testService.expectRequestEnd，配对使用。
 * 设置一个Restful请求的预期，并模拟该请求的服务器响应。真正的Restful请求需要在testService.expectRequest和testService.expectRequestEnd两者之间发起。
 * 测试预期放在testService.expectRequestEnd之后。
 *
 * @example
 * testService.simulateRequest的例子：
   ```
   describe('frontierApp restService Service', function() {
     var rootScope, location;
     var testService;

     beforeEach(function() {
       module('frontierApp');
       inject(function($controller, $injector) {
         rootScope = $injector.get('$rootScope');
         location = $injector.get('$location');
         testService = $injector.get('testService');
       });
     });
     describe('Handle success normal response', function() {

        it('result should be set', function() {
          var resData = {
            "status": "SUCCESS",
            "userStatus": null,
            "callId": 3992833,
            "message": "",
            "result": {
              'uid': 1000
            }
          };
          var reqData = {
            "uid": 1000,
            "username": "testuser"
          };

          var callback = function(result) {
            result.uid += 1;
            return result;
          };
          testService.simulateRequest(true, 'GET', '/test', reqData, null, 200, resData, callback);
          expect(rootScope.frontierTest.testResult.uid).toBe(1001);
        });
     });
   });
   ```
 *
 * testService.expectRequest及testService.expectRequestEnd的例子：
   ```
    describe('Automatically get captcha from server', function() {

      it('request should be sent to server and captcha image element src should be set with result.imageBase64', function() {
        var resData = {
          "status": "SUCCESS",
          "userStatus": null,
          "callId": 3992833,
          "message": "",
          "result": {captchaId: 1000, imageBase64: "test-base64code"}
        };

        testService.expectRequest('POST', '/restapi/captcha', null, null, 200, resData);

        // when html element created, it will automatically request a captcha image from server.
        elm = angular.element('<div captcha captcha-model="formCaptcha"></div>');
        compile(elm)(rootScope);
        testService.expectRequestEnd();

        expect(elm.find('img').attr('src')).toBe("data:image/png;base64," + resData.result.imageBase64);
      });
    });
   ```
 */
'user strict';

angular.module('frontierApp')

  .factory('testService', ['restService', '$httpBackend', '$rootScope', function(restService, $httpBackend, $rootScope) {

    $rootScope.frontierTest = {};
    var testCommon = {
      /**
       * @name testService.simulateRequest
       * @module testService
       * @kind function
       *
       * @description
       * 使用restService，封装$httpBackend，为需要进行restful接口请求的单元测试的提供模拟请求公共服务。
       * 调用接口后，服务将在$rootScope中添加一个名字为frontierTest的JSON变量，其中的成员testResult
       * 记录了从模拟服务器返回JSON对象的result数据。
       *
       * @param {Boolean} promise 是否使用restService的promiseRequest接口，否则使用restService的request接口
       * @param {String} method 模拟请求的HTTP方法
       * @param {String} uri 模拟请求的uri
       * @param {Object|null} reqData 模拟请求的JSON数据，设置为null时将忽略
       * @param {Object|null} header 模拟请求的header，设置为null时将忽略
       * @param {Number} httpCode 模拟服务器响应返回的httpCode，如200，404，500等
       * @param {Object} resJSON 模拟服务器响应返回的JSON数据
       * @param {Function|null} callback 当设置时，restService将使用callback来处理返回JSON对象的result
       * @param {Function|null} done 仅用于异步调用，设置为done函数（it或beforeEach的第二参数函数的参数），默认为null。
       */
      simulateRequest: function(promise, method, uri, reqData, header, httpCode, resJSON, callback, done) {
        var url = uri + ((reqData === null || (method === 'POST' || method === 'PUT')) ? "" : "?data=" + encodeURI(JSON.stringify(reqData)));
        if(header) {
          if(method === 'POST' || method === 'PUT') {
            $httpBackend.expect(method, url, reqData, header).respond(httpCode, resJSON);
          } else {
            $httpBackend.expect(method, url, null, header).respond(httpCode, resJSON);
          }
        } else {
          if(method === 'POST' || method === 'PUT') {
            $httpBackend.expect(method, url, reqData).respond(httpCode, resJSON);
          } else {
            $httpBackend.expect(method, url).respond(httpCode, resJSON);
          }
        }
        var callbackWrap = function(result) {
          $rootScope.frontierTest.testResult = result;
          if(typeof(callback) === "function") {
            callback(result);
          }
          if(typeof(done) === 'function') {
            setTimeout(function () {
              done();
            }, 0.0);
          }
        };
        if(promise) {
          restService.promiseRequest(uri, method, reqData).then(callbackWrap);
        } else {
          restService.request(uri, method, reqData, callbackWrap);
        }
        $httpBackend.flush();
      },
      /**
       * @name testService.expectRequest
       * @module testService
       * @kind function
       *
       * @description
       * 设置一个Restful请求的期望，并模拟该请求的服务器响应。需要和testService.expectRequestEnd配对使用，在两者之间发起请求。
       *
       * @param {String} method 模拟请求的HTTP方法
       * @param {String} uri 模拟请求的uri
       * @param {Object|null} reqData 模拟请求的JSON数据，设置为null时将忽略
       * @param {Object|null} header 模拟请求的header，设置为null时将忽略
       * @param {Number} httpCode 模拟服务器响应返回的httpCode，如200，404，500等
       * @param {Object} resJSON 模拟服务器响应返回的JSON数据
       */
      expectRequest: function(method, uri, reqData, header, httpCode, resJSON) {
        var url = uri + ((reqData === null || (method === 'POST' || method === 'PUT')) ? "" : "?data=" + encodeURI(JSON.stringify(reqData)));
        if(header) {
          if(method === 'POST' || method === 'PUT') {
            $httpBackend.expect(method, url, reqData, header).respond(httpCode, resJSON);
          } else {
            $httpBackend.expect(method, url, null, header).respond(httpCode, resJSON);
          }
        } else {
          if(method === 'POST' || method === 'PUT') {
            $httpBackend.expect(method, url, reqData).respond(httpCode, resJSON);
          } else {
            $httpBackend.expect(method, url).respond(httpCode, resJSON);
          }
        }
      },
      /**
       * @name testService.expectRequestEnd
       * @module testService
       * @kind function
       *
       * @description
       * 结束一个Restful请求的网络请求测试预期，和testService.expectRequest配对使用。
       *
       * @param {Boolean} reset 如设置为true，将会重置所有httpBackend中的预期。
       */
      expectRequestEnd: function(reset) {
        $httpBackend.flush();
        if(reset) {
          $httpBackend.resetExpectations();
        }
      }
    };
    return testCommon;
  }]);