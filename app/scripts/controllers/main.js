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
    $scope.meta = {};
    $scope.privacyNotice = false;
    $scope.mainContent = {};
    //Obtener Contenido General de contentful
    contentful.entry('6OjQJVDBf2CoIKyyg8EU2W').then(function(response){
      $scope.mainContent = response.data.fields;
      $scope.mainContent.cifrasPrincipales = $scope.mainContent.cifrasPrincipales.split("\\,");
      $scope.mainContent.descripciones = $scope.mainContent.descripciones.split("\\,");
      
      if($location.path == '/') $scope.initMeta();
      console.log($scope.mainContent);
    });
    $scope.initMeta = function(){
      $scope.meta = {
        title : $scope.mainContent.tituloMeta,
        description : $scope.mainContent.descripcionMeta,
        keywords : $scope.mainContent.keywordsMeta
      }
    }

    $scope.capitulos = {
      "1000" : "Servicios personales",
      "2000" : "Materiales y suministros",
      "3000" : "Servicios generales”",
      "4000" : "Subsidios y transferencias",
      "5000" : "Bienes muebles, inmuebles e intangibles",
      "6000" : "Inversión pública",
      "7000" :"Inversiones financieras y otras provisiones",
      "8000" : "Participaciones y aportaciones",
      "9000" : "Deuda Pública"
    };

  });
