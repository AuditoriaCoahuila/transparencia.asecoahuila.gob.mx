(function () {
  var controller = function ($scope, $filter, $location, $rootScope) {

      $scope.printedChart = 0;

      $scope.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      $scope.getRandomColor = function(){
        var baseColors = ['red','blue','orange'];
        var baseColorKey = $scope.getRandomInt(0, (baseColors.length-1) );
        var color = Please.make_color({
          base_color: baseColors[baseColorKey] //set your base color
        });  
        return color[0];      
        /*
        var r = $scope.getRandomInt(0, 255);
        var g = $scope.getRandomInt(0, 255);
        var b = $scope.getRandomInt(0, 255);
        return "rgb(" + r + "," + g + "," + b + ")"; */      
      }

      $scope.processData = function(data) {
        var newDataSet = [];

        _.each(data, function(item) {
          //console.log(item);
          newDataSet.push(
            {
              name: item.datos_entidad.nombre_completo,
              className: item.datos_entidad.nombre_completo.toLowerCase(),
              size: item.li_pe.pe_oficial,
              opacity: (1 - item.porcentaje_cumplimiento),
              cumplimiento: item.porcentaje_cumplimiento,
              resourceId: item.datos_entidad.id
            }
          );
        });
        return {children: newDataSet};
      };

      $scope.getTooltip = function(d){
          var html = '<p><strong>' + d.name + '</strong></p>';
          html += '<hr/>';
          html += '<p>Porcentaje de cumplimiento: ' + d.cumplimiento + '%</p>';
          html += '<p>PE oficial:</p>';
          html += '<p><strong class="quantity">' + $filter('currency')(d.size, '$') + '</strong></p>';
          return html;
      };

      $scope.initBubbles = function(){
        var data;
        data = $scope.chartData;

        //Verificando que el chart tenga datos
        if(data.length > 0){

          //Limpiando etiqueta svg en caso de redibujar
          d3.select('svg').remove();

          var bubbleWidth = parseInt(d3.select('#bubble-chart').style('width'), 10);
          var bubbleHeight = parseInt(d3.select('#bubble-chart').style('height'), 10);

          //Tooltip
          var tip = d3.tip()
            .attr('class', 'bubble-chart-tip')
            .offset([-10, 0])
            .html(function(d) {
                return $scope.getTooltip(d);
            });

          //Creando el svg sobre el cual se agregaran los circulos
          var svg = d3.select('#bubble-chart').append('svg')
            .attr('width', bubbleWidth)
            .attr('height', bubbleHeight);


          //Agregando el tooltip al svg
          svg.call(tip);

          var bubble = d3.layout.pack()
            .size([bubbleWidth, bubbleHeight])
            .padding(8) // padding between adjacent circles
            .value(function(d) {return d.size;}); // new data will be loaded to bubble layout


          var nodes = bubble.nodes($scope.processData(data))
            .filter(function(d){ return !d.children; });

          var vis = svg.selectAll('circle')
            .data(nodes, function(d){ return d.name; });     

          //Agregando circulos con sus respectivas propiedades
          vis.enter().append('circle')
            .attr('fill', function(d){ return $scope.getRandomColor(); } )
            .attr('opacity', function(d){ return d.opacity; })
            .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
            .attr('r', function(d) { return d.r; })
            .on('mouseover', function(d){
                tip.show(d); 
                d3.select(this).transition()
                .duration(750)
                .attr("r", function(d) { return d.r * 1.1; } );            
            })
            .on('mouseout', function(d){
                tip.hide(d); 
                d3.select(this).transition()
                .duration(750)
                .attr("r", function(d) { return d.r * 1; } );            
            })
            .on('click', function(d){
                $rootScope.$apply(function() {
                    //$location.path('/'+ d.name);
                    $location.path('/municipio/' + d.resourceId);
                });                    
            })        
            .attr('class', function(d) { return d.className; });
        }

        printedChart++;
      }

      $scope.resize = function(){
        setTimeout(function(){ 
            $scope.initBubbles();
          }, 1500);
      }

      d3.select(window).on('resize', $scope.resize);

      $scope.initBubbles();

      $scope.$watch('chartData', function(newValue, oldValue) {
          if (newValue){
              $scope.initBubbles();
          }
      }, true);


  };
  controller.$inject = ['$scope', '$filter', '$location', '$rootScope'];
  var directive = function () {
      return {
          controller : controller,
          scope : {
              chartData : '='
              //model : '=',
          },
          template : '<div class="asec-chart" id="bubble-chart"></div>'
          //templateUrl:
      };
  };
  app.directive('bubbleChart', directive);

}());