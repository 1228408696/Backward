'use strict';

angular.module('backward.index', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('index', {
        url: "/index",
        templateUrl: 'modules/index/index_view.html',
        controller: 'indexController'
      })
}])

.controller('indexController', ['$rootScope', '$scope', function ($rootScope, $scope) {
      /*$('body').delegate('.top_banner .btn li','mouseover',function(){
        var aBtn=$('.top_banner .btn li'),
            aImg=$('.top_banner .img');

        aBtn.removeClass('select');
        $(this).addClass('select');
        aImg.stop().animate({'opacity':'0'},800);
        aImg.eq($(this).index()).stop().animate({'opacity':'1'},800);
      });*/
}]);