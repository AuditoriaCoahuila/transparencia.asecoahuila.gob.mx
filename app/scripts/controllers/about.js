'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the asecApp
 */
angular.module('asecApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
