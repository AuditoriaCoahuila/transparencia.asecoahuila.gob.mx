'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asecApp
 */

app.controller('municipioCTL',['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
	 $scope.municipioId = $routeParams.municipioId;


	$scope.municipio = {};

	$scope.getMunicipio = function(){
		var nMunicipios = 38;
		var baseUrl = 
			'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_entidad_todos_datos&id_entidad=';

		var id = $scope.municipioId;

		var requestUrl = baseUrl + id + '&callback=JSON_CALLBACK';
		$http.jsonp(requestUrl)
	  	.success(function(data, status, headers, config) {	
	  		console.log(id);
	  		console.log(data);
				$scope.municipio = data[id];
				console.log($scope.municipio);
		})
		.error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		});			
	};

	$scope.getMunicipio();


}]);
