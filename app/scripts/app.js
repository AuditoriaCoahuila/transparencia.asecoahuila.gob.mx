'use strict';

/**
 * @ngdoc overview
 * @name asecApp
 * @description
 * # asecApp
 *
 * Main module of the application.
 */
var app = angular
  .module('asecApp', [
    'ngMaterial',
    'ngRoute',
    'perfect_scrollbar',
    'contentful',
    'btford.markdown',
    'angular-carousel'
]);
app
  .config(function(contentfulProvider){
    contentfulProvider.setOptions({
        space: 'ln1xrgztle3b',
        accessToken: 'f308ed71e5310a68f2547d8696ae5c4e4e20c466073c047d61f2b983c896f8fa'
    });
  });

app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

    $routeProvider.when('/',{
        templateUrl : '/views/home.html',
        controller : 'homeCTL',
        redirectTo: function(current, path, search){
          if(search.goto){
            // if we were passed in a search param, and it has a path
            // to redirect to, then redirect to that path
            return '/' + search.goto;
          }
          else{
            // else just redirect back to this location
            // angular is smart enough to only do this once.
            return '/';
          }
    }
    }).when('/municipio/:municipioId', {
        templateUrl: '/views/municipio.html',
        controller : 'municipioCTL',
    }).otherwise({
        redirectTo: '/'
    });
}]);

app.filter('objectLimitTo', [function(){
    return function(obj, limit){
        var keys = Object.keys(obj);
        if(keys.length < 1){
            return [];
        }

        var ret = new Object,
        count = 0;
        angular.forEach(keys, function(key, arrayIndex){
            if(count >= limit){
                return false;
            }
            ret[key] = obj[key];
            count++;
        });
        return ret;
    };
}]);

/*
app.config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.useXDomain = true;
      $httpProvider.defaults.withCredentials = true;
      delete $httpProvider.defaults.headers.common["X-Requested-With"];
      $httpProvider.defaults.headers.common["Accept"] = "application/json";
      $httpProvider.defaults.headers.common["Content-Type"] = "application/json";

    }
]);*/

