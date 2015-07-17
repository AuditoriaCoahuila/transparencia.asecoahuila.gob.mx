'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:DocumentCtrl
 * @description
 * # DocumentCtrl
 * Controller of the asecApp
 */
angular.module('asecApp')
  .controller('DocumentCtrl',['$scope', '$http' ,function ($scope, $http) {
    $scope.search = {};
    $scope.isLoaded = false;
    $scope.folders = ['Reporte IMCO','Generales'];

    var nMunicipios = 38,
      baseUrlDocs =
        'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_n_entidades_todos_datos&id_entidad=',
      baseUrl =
        'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_evaluacion_n_entidades&id_entidad=',
      ids = [];

      for( var i=1; i < (nMunicipios+1) ; i++ ){
        ids.push(i);
			}
      var idsString = ids.join(','),
          requestUrl = baseUrl + idsString + '&callback=JSON_CALLBACK';

    $http.jsonp(requestUrl)
      .success(function(data) {
        $scope.municipios = data;
        $scope.isLoaded = true;
      }).error(function(data) {
      });


    $scope.isNotLoadedDocs = {};
    $scope.getDocs = function(id){
      var requestUrlDocs = baseUrlDocs + id + '&callback=JSON_CALLBACK';
      $scope.isNotLoadedDocs[id] = true;
      $http.jsonp(requestUrlDocs)
        .success(function(data) {
          $scope.municipios[id] = data[id];
          $scope.isNotLoadedDocs[id] = false;
        }).error(function(data) {
          $scope.isNotLoadedDocs[id] = false;
        });

    };

    //$scope.getMunicipio();


  }]);
