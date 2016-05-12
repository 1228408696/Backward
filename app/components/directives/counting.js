/**
 * Created by zhouhua
 * @date 15/8/8.
 *
 * Usage example:
 *
 * ```
 *   <counting coungting-model="countingConf"></counting>
 *   or
 *   <div counting counting-model="countingConf"></div>
 * ```
 *
 * Where `counting-model` bind the scope variable `countingConf` of the current controller.
 * `countingConf` is the configuration object or an numeric for counting.
 *
 * Counting configuration object example:
 *
 * ```
 * $scope.coutingConf = {
 *   'from': 10,          // counting from this numeric
 *   'mode': 'oneway',    // 'oneway' for counting one time, 'recur' for counting recurrently, default is 'oneway'
 *   'direction': 'desc', // 'desc' for descend(count down) or 'asc' for ascend(count up)
 *   'step': 1,           // amount to be changed each interval
 *   'interval': 1000,    // 1 second
 *   'target': 0,         // count down or count up to this target
 *   'callback': function(elm, scope, location){} // Optional. Callback function which will call went counting reach the target,
 *                                                // the element, $scope and $location will be passed as the parameters of the callback function.
 * };
 * ```
 *
 * if `$scope.countingConf` is an integer, it should be larger then 0. Suppose `$scope.countingConf` is `999`, this is the same as
 *
 * ```
 * $scope.coutingConf = {
 *   'from': 999,
 *   'mode': 'oneway',
 *   'direction': 'desc',
 *   'step': 1,
 *   'interval': 1000,
 *   'target': 0
 * };
 * ```
 *
 * Full example:
 *
 * ```
 * <div ng-controller="RootController">
 *   <div ng-controller="CountingController">
 *     <div counting counting-model="countingConf"></div>
 *   </div>
 *   <hr></hr>
 *   <div ng-controller="Counting2Controller">
 *     <div counting counting-model="countingConf"></div>
 *   </div>
 * </div>
 *
 * <script src="../../bower_components/angular/angular.js"></script>
 * <script src="../../bower_components/angular-route/angular-route.js"></script>
 * <script src="../../bower_components/angular-resource/angular-resource.js"></script>
 * <script type="text/javascript">
 *   // Declare app level module which depends on modules, and components
 *   angular.module('frontierApp', [
 *     'ngRoute',
 *     'frontierApp.counting',
 *     'frontierApp.countExample',
 *     'frontierApp.countExample2']
 *   )
 *   .controller('RootController', function($rootScope, $scope) {
 *
 *   });
 *   angular.module('frontierApp.countExample', [])
 *   .controller('CountingController', function($rootScope, $scope) {
 *      $scope.countingConf = {
 *        'from': 5,
 *        'mode': 'oneway',
 *        'direction': 'desc',
 *        'step': 1,
 *        'interval': 1000,
 *        'target': 0,
 *        'callback': function(elm, scope, location) {
 *           elm.html("5 seconds counted over!");
 *        }
 *      };
 *    });
 *    angular.module('frontierApp.countExample2', [])
 *    .controller('Counting2Controller', function($rootScope, $scope) {
 *      $scope.countingConf = {
 *        'from': 5,
 *        'mode': 'recur',
 *        'direction': 'desc',
 *        'step': 1,
 *        'interval': 1000,
 *        'target': 0,
 *        'callback': function(elm, scope, location) {
 *           elm.html("5 seconds counted over!");
 *        }
 *      };
 *   });
 * </script>
 * <script src="../../components/core/core.js"></script>
 * <script src="../../components/directives/counting.js"></script>
 * ```
 */

'use strict';

;(function($, window, document, undefined) {
  var CountingElement = function(ele, opt) {
    this.$element = ele;
    this.defaults = {
      'from': 10,
      'mode': 'oneway',
      'direction': 'desc', // desc for descend or asc for ascend
      'step': 1,
      'interval': 1000, // 1 second
      'target': 0
    };
    this.options = angular.extend({}, this.defaults, opt);
    if(this.options.direction != 'desc' && this.options.direction != 'asc') {
      console.error("direction in Count option should either be 'desc' or be 'asc'!");
      return;
    }
    if(this.options.mode && this.options.mode === 'recur') {
      this.round = true;
    } else {
      this.round = false;
    }
    if(ele.frontierCountingObj !== undefined) {
      if(ele.frontierCountingObj.timer !== undefined) {
        window.clearInterval(ele.frontierCountingObj.timer);
      }
      delete ele.frontierCountingObj;
    }
    ele.frontierCountingObj = this;
  };

  CountingElement.prototype = {
    setToCount: function() {
      this.currentVal = this.options.from;
      this.$element.children('.frontier-counting-object').html(this.currentVal);
      this.frontierCountingObj.startCount(this.$element);
    },

    startCount: function() {
      this.reset();
      if(this.timer === undefined) {
        var f = this.counting;
        this.timer = window.setInterval(f.bind(this, this), this.options.interval);
      }
    },

    counting: function() {
      var val = this.currentVal;

      var target = this.options.target;
      if(this.options.direction == 'desc' && val >= target) {
        val -= this.options.step;
        if(val < target) {
          val = target;
        }
      } else if(this.options.direction == 'asc' && val <= target) {
        val += this.options.step;
        if(val > target) {
          val = target;
        }
      }
      this.currentVal = val;
      val = parseFloat(val.toFixed(3));
      this.$element.children('.frontier-counting-object').html(val);
      if(val == target) {
        window.clearInterval(this.timer);
        this.timer = undefined;
        if(this.options.callback !== null && this.options.callback !== undefined) {
          this.options.callback(this.$element, this.options.inject.injScope, this.options.inject.injLocation);
        }
        if(this.round) {
          this.startCount();
        }
      }
    },

    reset: function() {
      this.currentVal = this.options.from;
      this.$element.html("<div class=\"frontier-counting-object\">"+this.currentVal+"</div>");
      if(this.timer !== undefined) {
        window.clearInterval(this.timer);
        this.timer = undefined;
      }
    },

    stop: function() {
      if(this.timer !== undefined) {
        window.clearInterval(this.timer);
        this.timer = undefined;
      }
    }
  };

  $.frontierCounting = function(elm, opt) {
    var countingObj = new CountingElement(elm, opt);
    countingObj.startCount();
    return;
  };
})(angular.element, window, document);

angular.module('frontierApp.counting', [])

  .directive('counting', ['$location', function($location) {
    return {
      "restrict": "EA",
      "scope": {
        "countingModel": '='
      },
      "link": function (scope, elm, attrs) {
        if(angular.isNumber(scope.countingModel)) {
          angular.element.frontierCounting(elm,
            {
              from: scope.countingModel,
              inject: {
                injScope: scope,
                injLocation: $location
              }
            }
          );
        } else {
          var cModel = scope.countingModel;
          cModel.inject = {
            injScope: scope,
            injLocation: $location
          }
          angular.element.frontierCounting(elm, cModel);
        }
      },
      "template": ""
    };
  }]);
