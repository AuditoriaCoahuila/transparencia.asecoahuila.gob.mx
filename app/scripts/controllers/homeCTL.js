'use strict';

/**
 * @ngdoc function
 * @name asecApp.controller:homeCTL
 * @description
 * # homeCTL
 * Controller of the asecApp
 */

app.controller('homeCTL',['$scope','$http', '$location', '$rootScope', function ($scope, $http, $location, $rootScope) {
	$scope.isLoaded = false;
	$scope.municipios = [];
	$scope.municipiosCoords= [];
	$scope.bubbleChartData = [];
	$scope.randomMun = {};
	$scope.limitDocs = 5;
	$scope.tip = {};
	$scope.showContentList = [];
	$scope.initMeta();
	$scope.getMunicipiosStats = function(){
		var nMunicipios = 38;
		var baseUrl =
			'http://desarrollo.optimit.com.mx/auditoria_coahuila/web_service.php?accion=get_evaluacion_n_entidades&id_entidad=';
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

		$scope.getMuncipioDetail(20,function(err,result){
			if (err) {
				console.log(err);
			} else {
				$scope.randomMun = result;
			}
		});
	};

	$scope.getMunicipiosData = function(){
		$http.get('/json_municipios.json')
	  	.success(function(data) {
	  		$scope.municipiosCoords = data;
	  		//console.log($scope.municipiosCoords);
	  		$scope.getMunicipiosStats();
			})
		  .error(function(data) {

		  });
	};


  $scope.getTooltip = function(d){
  	var cumplimiento2013 = false;
  	var cumplimiento2014 = false;

    var html = '<p><strong>' + d.name + '</strong></p>';
    html += '<hr/>';

  	if(d.info.porcentaje_cumplimiento['2013']){
			cumplimiento2013 = d.info.porcentaje_cumplimiento['2013'].porcentaje_cumplimiento;
    	html += '<p>Porcentaje de cumplimiento en el IIPM 2013: ' + cumplimiento2013 + '%</p>';
  	}

  	if(d.info.porcentaje_cumplimiento['2014']){
			cumplimiento2014 = d.info.porcentaje_cumplimiento['2014'].porcentaje_cumplimiento;
    	html += '<p>Porcentaje de cumplimiento en el IIPM 2014: ' + cumplimiento2014 + '%</p>';
  	}

    return html;

  };


  $scope.processData = function(data) {
    var newDataSet = [];
    var maxR = 20;
    _.each(data, function(item) {
    	if($scope.municipios[item.id - 1])
    		var sizeFactor = $scope.municipios[item.id - 1].porcentaje_cumplimiento['2014'].porcentaje_cumplimiento;
    	else console.log('error here');
    	sizeFactor = (sizeFactor - 50) / 50;
    	//console.log(sizeFactor);
      	newDataSet.push(
	        {
	          	name: item.name,
	          	lat: item.coords.lat,
	          	lng: item.coords.lng,
	          	id: item.id,
				size: ( sizeFactor*maxR ),
				info: $scope.municipios[item.id - 1]
	        }
      	);
    });
    return {children: newDataSet};
  };

  $scope.triggerTip = function(circleId, index){

  	if( $(window).width() >= 960 ){
	  	angular.forEach( $scope.showContentList, function(v,i){
	  		$scope.showContentList[i] = false;
	  	});
	  	$scope.showContentList[index] = !$scope.showContentList[index];

	  	var svg = d3.select("#data-map-home");
	  	var data = d3.select('.map-circle-' + circleId).data();
	  	if(data.length > 0){
	          var c = svg.select('.map-circle-' + circleId).node();
	          var e = document.createEvent('UIEvents');
	          e.initUIEvent('mouseover', true, true);
	          c.dispatchEvent(e);
	          //$scope.tip.show(data[0], c);
	  	}
		}
		else{
			$location.path('/municipio/'+circleId);
		}
  };

	$scope.drawState = function(){

		var move = function() {
		  var t = d3.event.translate;
		  var s = d3.event.scale;
		  var h = height / 3;

		  t[0] = Math.min(width / 2 * (s - 1), Math.max(width / 2 * (1 - s), t[0]));
		  t[1] = Math.min(height / 2 * (s - 1) + h * s, Math.max(height / 2 * (1 - s) - h * s, t[1]));

		  zoom.translate(t);
		  circles.attr("transform", "translate(" + t + ")scale(" + s + ")");
		  circles.attr('r', function(d) { return d.size/s; });
		  muns.attr("transform", "translate(" + t + ")scale(" + s + ")");
		};

		var zoom = d3.behavior.zoom()
		    .scaleExtent([1, 8])
		    .on("zoom", move);

    zoom = function(){};


		//var width = 800;
		var width = $('#data-map-home').width();
		//var width = document.getElementById('data-map-home').offsetWidth;
		var height = width + 45;

		var topo,projection,path,svg,g,muns,circles;

		var insertCircles = function(){
	    //Tooltip
	    $scope.tip = d3.tip()
	      .attr('class', 'bubble-chart-tip map-tip')
	      .offset([-10, 0])
	      .html(function(d) {
	          return $scope.getTooltip(d);
	      });

	    svg.call($scope.tip);



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

			circles = vis.enter().append('circle')
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
				.attr('r', function(d){ return d.size; })
				.attr('opacity', 0.8)
				.style('stroke', '#2A82B4')
				.style('fill', '#2A82B4')
				.attr('class', function(d){ return 'map-circle-'+d.id })
				.on('mouseover', function(d){
				  $scope.tip.show(d);
				})
				.on('mouseout', function(d){
				  $scope.tip.hide(d);
				})
			  .on('click', function(d){
		      $rootScope.$apply(function() {
		      	$scope.tip.hide(d);
	          $location.path('/municipio/' + d.id);
			  	});
		    });
		};

		var draw = function(topo) {
		  muns = g.selectAll("#data-map-home path").data(topo);

		  muns.enter().append("path")
		      .attr("class", "mun")
		      .attr("d", path);
		      //.attr("id", function(d,i) { return d.id; })
		      //.attr("title", function(d,i) { return d.properties.name; })
		      //.style("fill", function(d, i) { return d.properties.color; });

		  //ofsets plus width/height of transform, plsu 20 px of padding, plus 20 extra for tooltip offset off mouse
		  var offsetL = document.getElementById('data-map-home').offsetLeft+(width/2)+40;
		  var offsetT =document.getElementById('data-map-home').offsetTop+(height/2)+20;

		  insertCircles();

		};


		var redraw = function() {
		  width = document.getElementById('data-map-home').width;
		  height = width;
		  d3.select('#data-map-home svg').remove();
		  setup(width,height);
		  draw(topo);
		}

		var throttleTimer;
		var throttle = function() {
		  window.clearTimeout(throttleTimer);
		    throttleTimer = window.setTimeout(function() {

		      redraw();
		    }, 200);
		};

		//d3.select(window).on("resize", throttle);


		var setup = function(width,height){

			var coodsCenter = [-102.077342, 27.226009];

		  projection = d3.geo.mercator()
		    .translate([0, 0])
		    .center(coodsCenter)
		    .scale(6000);

		  path = d3.geo.path()
		      .projection(projection);

		  var translateX = 200;
		  var translateY = height / 2;

		  svg = d3.select("#data-map-home").append("svg")
		      .attr("width", width)
		      .attr("height", height)
		      .append("g")
		      .attr("transform", "translate(" + translateX + "," + translateY + ")")
		      .call(zoom);

		  svg.call(zoom);

		  g = svg.append("g");

		};

		setup(width,height);

		d3.json("/mx_tj.json", function(error, mx) {
		  var municipios = topojson.feature(mx, mx.objects.municipalities).features.filter(function(d) { return d.properties.state_code === 5; });
		  topo = municipios;
		  draw(topo);
		});

	};

	$scope.getMunicipiosData();

  $scope.bannerGraphImgs = [
    { image: '/images/grafica1.png' },
    { image: '/images/grafica2.png' },
  ];

  $scope.bannerGraphImgsIndex = 0;
  $scope.carouselNext = function(){
    $scope.bannerGraphImgsIndex = ++$scope.bannerGraphImgsIndex % $scope.bannerGraphImgs.length;
  };

  $scope.carouselBack = function(){
    $scope.bannerGraphImgsIndex = --$scope.bannerGraphImgsIndex % $scope.bannerGraphImgs.length;
  };


}]);
