'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the asecApp
 */

app.controller('homeCTL',['$scope','$http', function ($scope, $http) {

	$scope.municipios = [];
	$scope.bubbleChartData = [];

	$scope.getMunicipios = function(){
		var nMunicipios = 38;
		var baseUrl = 
			'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_n_entidades_todos_datos&id_entidad=';
		var ids = '';

		for( var i=1; i < (nMunicipios+1) ; i++ ){
			if(i == (nMunicipios) ){
				ids += i;
			}else{
				ids += i+',';				
			}
		}
		
		var requestUrl = baseUrl + ids + '&callback=JSON_CALLBACK';
		$http.jsonp(requestUrl)
	  	.success(function(data, status, headers, config) {	
			
				_.each(data, function(mun) {
				  if(mun){	
				  	$scope.municipios.push(mun);
				  }
				});

				$scope.bubbleChartData = $scope.municipios;			
			})
		  .error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });			
	};

	$scope.getMunicipios();


}]);
