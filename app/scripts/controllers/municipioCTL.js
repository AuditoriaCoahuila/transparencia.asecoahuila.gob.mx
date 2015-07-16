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
	$scope.folders = ['Reporte IMCO','Generales'];

	$scope.drawEgresos = function(){
		var egresosList = $scope.municipio.informacion_presupuestal['2014'].Egresos;
		$scope.egresos = [];

		angular.forEach($scope.capitulos , function(cap,key){
			var capObject = egresosList['Capítulo ' + key];
			capObject['Descripcion'] = $scope.capitulos[key];
			$scope.egresos.push(capObject);
		});

		$scope.presupuestoEgresos = egresosList['Presupuesto de Egresos 2014 (Adenda)'];
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
				$scope.drawEgresos();
		})
		.error(function(data) {
		});			
	};

	$scope.getMunicipio();


}]);
