'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:municipioCTL
 * @description
 * # municipioCTL
 * Controller of the asecApp
 */

app.controller('municipioCTL',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.municipioId = $routeParams.municipioId;
	$scope.municipio = {};
	$scope.isLoaded = false;

	$scope.drawEgresos = function(){
		//$scope.municipio.informacion_presupuestal['2014'].Egresos;
	};


	$scope.getMunicipio = function(){
		var baseUrl = 
			'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_entidad_todos_datos&id_entidad=';
		var id = $scope.municipioId;
		var requestUrl = baseUrl + id + '&callback=JSON_CALLBACK';

		$http.jsonp(requestUrl)
	  	.success(function(data) {
  			console.log(data);
				$scope.municipio = data[id];
				$scope.isLoaded = true;
				$scope.drawRadial();
		})
		.error(function(data) {
		});			
	};

	$scope.getMunicipio();


}]);
