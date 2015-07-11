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
    'ngRoute'
]);


app.config(['$routeProvider','$locationProvider',function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

    $routeProvider.when('/',{
        templateUrl : '/views/home.html',
        controller : 'homeCTL',
        redirectTo: function(current, path, search){
          if(search.goto){
            // if we were passed in a search param, and it has a path
            // to redirect to, then redirect to that path
            return "/" + search.goto
          }
          else{
            // else just redirect back to this location
            // angular is smart enough to only do this once.
            return "/"
          }
    }
    }).when('/contratos', {
        templateUrl: 'templates/pages/contracts.html',
        controller : 'contratoController', 
        reloadOnSearch: false
    }).otherwise({
        redirectTo: '/'
    });
}]);

