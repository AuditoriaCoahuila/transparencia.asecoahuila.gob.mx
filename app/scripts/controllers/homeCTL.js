'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:homeCTL
 * @description
 * # homeCTL
 * Controller of the asecApp
 */

app.controller('homeCTL',['$scope','$http', function ($scope, $http) {
	$scope.isLoaded = false;
	$scope.municipios = [];
	$scope.municipiosCoords= [];
	$scope.bubbleChartData = [];

	$scope.getMunicipiosStats = function(){
		var nMunicipios = 38;
		var baseUrl = 
			'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_n_entidades_todos_datos&id_entidad=';
		var ids = '';

		for( var i=1; i < (nMunicipios+1) ; i++ ){
			if(i === (nMunicipios) ){
				ids += i;
			}else{
				ids += i+',';				
			}
		}
		
		var requestUrl = baseUrl + ids + '&callback=JSON_CALLBACK';
		$http.jsonp(requestUrl)
	  	.success(function(data) {	

				_.each(data, function(mun) {
				  if(mun){	
				  	$scope.municipios.push(mun);
				  }
				});
			
				$scope.isLoaded = true;
				$scope.bubbleChartData = $scope.municipios;
				$scope.drawState();	
			})
		  .error(function(data) {
		  
		  });			
	};

	$scope.getMunicipiosData = function(){
		$http.get('/scripts/municipios.json')
	  	.success(function(data) {	
	  		$scope.municipiosCoords = data;
	  		$scope.getMunicipiosStats();
			})
		  .error(function(data) {
		  
		  });	
	};


  $scope.getTooltip = function(d){
		d.cumplimiento =  0.65;
    var html = '<p><strong>' + d.name + '</strong></p>';
    html += '<hr/>';
    html += '<p>Porcentaje de cumplimiento: ' + d.cumplimiento + '%</p>';
    return html;

  };	


  $scope.processData = function(data) {
    var newDataSet = [];

    _.each(data, function(item) {
      newDataSet.push(
        {
          name: item.name,
          lat: item.coords.lat,
          lng: item.coords.lng,
          id: item.id
        }
      );
    });
    return {children: newDataSet};
  };  

	$scope.drawState = function(){

		var width, height;

		/*var width = 960,
		    height = 500;*/

    width = parseInt(d3.select('#data-map-home').style('width'), 10);
    height = parseInt(d3.select('#data-map-home').style('height'), 10);	


		var x = d3.scale.linear()
		    .domain([0, width])
		    .range([0, width]);

		var y = d3.scale.linear()
		    .domain([0, height])
		    .range([height, 0]);


    var coodsCenter = [-101.984106, 27.452909];	    

		var projection = d3.geo.mercator()
		    .scale(6000)
		    //.center([-102.34034978813841, 24.012062015793]);
		    .translate([width/2, (height*0.8)/2])
		    .center(coodsCenter);

    //Tooltip
    var tip = d3.tip()
      .attr('class', 'bubble-chart-tip')
      .offset([-10, 0])
      .html(function(d) {
          return $scope.getTooltip(d);
      });

    

		var svg = d3.select('#data-map-home').append('svg')
		    .attr('width', width)
		    .attr('height', height);

		svg.call(tip);

		var g = svg.append('g');

		d3.json('/scripts/mx_tj.json', function(error, mx) {
		  svg.selectAll('#data-map-home path')
		    //.data(topojson.feature(mx, mx.objects.municipalities).features)
		    .data(topojson.feature(mx, mx.objects.municipalities).features.filter(function(d) { return d.properties.state_code === 5; }))		    
		    .enter().append('path')
		    .attr('d', d3.geo.path().projection(projection))
		    //.attr("fill", "transparent")
		    .style('stroke', '#333')
		    .style('stroke-width', '.2px')
		    .attr('class', 'mun');
		  
		  g.selectAll('#data-map-home path')
		    .data(topojson.feature(mx, mx.objects.states).features.filter(function(d) { return d.properties.state_code === 5; }))
		    .enter().append('path')
		    .attr('d', d3.geo.path().projection(projection))
		    //.attr("fill", "transparent")
		    .attr('class', 'state')
		  	.style('stroke', '#fff');

		  

		  var data = $scope.processData( $scope.municipiosCoords );

      var bubble = d3.layout.pack()
        .size([width, height])
        .padding(8) // padding between adjacent circles
        .value(function(d) {return d.size;}); // new data will be loaded to bubble layout

      var nodes = bubble.nodes(data)
        .filter(function(d){ return !d.children; });

      var vis = svg.selectAll('circle')
        .data(nodes, function(d){ return d.name; });  

		  var maxR = 50;

			var coordinates = projection(coodsCenter);

      vis.enter().append('circle')
				.attr('cx', function(d){
					var coords = [d.lng, d.lat];
					var coordinates = projection(coords);
					return coordinates[0];
				})
				.attr('cy', function(d){
					var coords = [d.lng, d.lat];
					var coordinates = projection(coords);
					return coordinates[1];
				})
				.attr('r', function(){ return 0.6*maxR; })
				.attr('opacity', 0.8)
				.style('stroke', '#2A82B4')
				.style('fill', '#2A82B4')
				.on('mouseover', function(d){
				  tip.show(d); 
				  d3.select(this).transition()
				  .duration(750)
				  .attr('r', function(d) { return ( 0.6*maxR ) * 1.2; } );            
				})
				.on('mouseout', function(d){
				  tip.hide(d); 
				  d3.select(this).transition()
				  .duration(750)
				  .attr('r', function(d) { return 0.6*maxR; } );            
				})              

		});

	};

	$scope.getMunicipiosData();

}]);
