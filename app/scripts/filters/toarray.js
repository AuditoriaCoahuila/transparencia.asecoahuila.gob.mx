'use strict';

/**
 * @ngdoc filter
 * @name asecApp.filter:toArray
 * @function
 * @description
 * # toArray
 * Filter in the asecApp.
 */
angular.module('asecApp')
  .filter('toArray', function () {
    return function (obj) {
      	if (!(obj instanceof Object)) return obj;
	    return _.map(obj, function(val, key) {
	        return Object.defineProperty(val, '$key', {__proto__: null, value: key});
	    });
    };
  });