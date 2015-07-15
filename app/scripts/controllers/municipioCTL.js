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

	$scope.drawRadial = function(){

    var rp1 = radialProgress(document.getElementById('ingreso-per-capita'))
        .diameter(150)
        .value(78)
        //.label('Ingreso per capita del municipio')
        .render();	
    var rp2 = radialProgress(document.getElementById('egreso-per-capita'))
        .diameter(150)
        .value(82)
        //.label('Ingreso per capita del municipio')
        .render();
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
