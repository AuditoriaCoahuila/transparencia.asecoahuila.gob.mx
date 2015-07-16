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

    $scope.capitulos = {
      "1000" : "Servicios personales",
      "2000" : "Materiales y suministros",
      "3000" : "Servicios generales”",
      "4000" : "Subsidios y transferencias",
      "5000" : "Bienes muebles, inmuebles e intangibles",
      "6000" : "Inversión pública"
    };

  });
