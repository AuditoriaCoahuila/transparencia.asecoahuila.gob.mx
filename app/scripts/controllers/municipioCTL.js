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
  $scope.documents = [];
  $scope.selectedYear = '2014';

	$scope.drawEgresos = function(){
		var egresosList = $scope.municipio.informacion_presupuestal['2014'].Egresos;
        var ingresosList = $scope.municipio.informacion_presupuestal['2014'].Ingresos;

		$scope.egresos = [];
    $scope.ingresos_egresos = {};
    $scope.documents.push($scope.municipio.documentos);

		angular.forEach($scope.capitulos , function(cap,key){
			var capObject = {};
			capObject = egresosList['Capítulo ' + key] || {'valor':0};
			capObject['Descripcion'] = $scope.capitulos[key];

			if( parseInt(capObject['valor']) <= 0 ){
				capObject['concepto'] = 'Capítulo ' + key;
				capObject['valor'] =  '0';
			}
			$scope.egresos.push(capObject);
		});

    var egresos_per_capita = { 'valor' : 4521.31, 'concepto' : 'Promedio'};
    $scope.ingresos_per_capita = ingresosList['Ingresos Per C\u00e1pita por Municipio'] || { 'valor' : 0 };
    $scope.ingresos_per_capita.concepto = 'Ingresos per cápita '+$scope.municipio.datos_entidad.nombre;
    $scope.ingresos_egresos = [];
    $scope.ingresos_egresos.push($scope.ingresos_per_capita);
    $scope.ingresos_egresos.push(egresos_per_capita);

		$scope.presupuestoEgresos = egresosList['Presupuesto de Egresos 2014 (Adenda)'];
	};


	$scope.getMunicipio = function(){
		var baseUrl = 
			'http://tnservice.asecoahuila.gob.mx/web_service.php?accion=get_entidad_todos_datos&id_entidad=';
		var id = $scope.municipioId;
		var requestUrl = baseUrl + id + '&callback=JSON_CALLBACK';

		$http.jsonp(requestUrl)
	  	.success(function(data) {
				$scope.municipio = data[id];
				$scope.isLoaded = true;
				$scope.drawEgresos();
				$scope.meta.title = $scope.municipio.datos_entidad.nombre+' - '+$scope.mainContent.tituloMeta;
				$scope.meta.description = $scope.municipio.datos_entidad.descripcion_250;
				$scope.meta.keywords = $scope.municipio.datos_entidad.nombre+", "+$scope.mainContent.keywordsMeta;
		})
		.error(function(data) {
		});	

	};

	$scope.setYear = function(year){
		$scope.selectedYear = year;
	};
	$scope.showSize = function(arr){
		var size = Object.keys(arr).length;
		return size;
	}

	$scope.getMunicipio();


}]);
