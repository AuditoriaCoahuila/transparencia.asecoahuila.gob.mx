'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asecApp
 */
angular.module('asecApp')
  .controller('MainCtrl', function ($scope,contentful,$document,$location) {
  	//Obtener Contenido General de contentful
  	contentful.entry('6OjQJVDBf2CoIKyyg8EU2W').then(function(response){
  		$scope.mainContent = response.data.fields;
      $scope.mainContent.cifrasPrincipales = $scope.mainContent.cifrasPrincipales.split("\\,");
      $scope.mainContent.descripciones = $scope.mainContent.descripciones.split("\\,");
      console.log($scope.mainContent);
  	});
    $scope.mainContent = {};

  });
