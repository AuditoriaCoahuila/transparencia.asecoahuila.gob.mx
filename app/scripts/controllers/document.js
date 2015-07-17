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
    $scope.$watch('search', function(a,b){
      console.log(a,b);
    })
    $scope.isLoaded = false;
    $scope.folders = ['Reporte IMCO','Generales'];

    $scope.getMunicipio = function(){
      //return ($scope.isLoaded = true);
      var nMunicipios = 38,
          baseUrl = 'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_n_entidades_todos_datos&id_entidad=',
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
          console.log("err", data);
        });
    };

    $scope.getMunicipio();


  }]);
