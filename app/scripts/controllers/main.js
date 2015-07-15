'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asecApp
 */
angular.module('asecApp')
  .controller('MainCtrl', function ($scope,contentful) {
  	//Obtener Contenido General de contentful
  	contentful.entry('6OjQJVDBf2CoIKyyg8EU2W').then(function(response){
  		$scope.mainContent = response.data.fields;
      $scope.mainContent.cifrasPrincipales = $scope.mainContent.cifrasPrincipales.split("\\,");
      console.log($scope.mainContent);
      console.log('loaded main content');
  	})
    $scope.mainContent = {};

  });
