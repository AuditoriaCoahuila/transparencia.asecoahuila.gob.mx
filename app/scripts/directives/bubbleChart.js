(function () {
    var controller = function ($scope, $filter, $location, $rootScope) {

        $scope.processData = function(data) {
            var obj = data.countriesMsgVol;
            var newDataSet = [];
            for(var prop in obj) {
                newDataSet.push(
                    {
                        name: prop,
                        className: prop.toLowerCase(),
                        size: obj[prop],
                    }
                );
            }
            return {children: newDataSet};
        };

        $scope.getTooltip = function(d){
            var html = '<p><strong>' + d.name + '</strong></p>';
            html += '<hr/>';
            html += '<p>This is a photoshop version of lorem ipsum. Prom vida  nibl vel aquet</p>';
            html += '<p><strong class="quantity">' + $filter('currency')(d.size, '$') + '</strong></p>';
            return html;
        };

        $scope.initBubbles = function(){
            var data = {'countriesMsgVol': {
                'CA': 270452,
                'US': 542150,
                'EC': 642150,
                'CU': 610043,
                'BR': 89003,
                'MX': 192945,
                'Other': 254323
            }};

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
                .padding(3) // padding between adjacent circles
                .value(function(d) {return d.size;}); // new data will be loaded to bubble layout


            var nodes = bubble.nodes($scope.processData(data))
                .filter(function(d){ return !d.children; });

            var vis = svg.selectAll('circle')
                .data(nodes, function(d){ return d.name; });     

            //Agregando circulos con sus respectivas propiedades
            vis.enter().append('circle')
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
                    console.log('d.name');
                    $rootScope.$apply(function() {
                        $location.path('/'+ d.name);
                    });                    
                })        
                .attr('class', function(d) { return d.className; });
        }

        $scope.resize = function(){
            $scope.initBubbles();
        }

        d3.select(window).on('resize', $scope.resize);

        $scope.initBubbles();

    };
    controller.$inject = ['$scope', '$filter', '$location', '$rootScope'];
    var directive = function () {
        return {
            controller : controller,
            scope : {
                //model : '=',
            },
            template : '<div class="asec-chart" id="bubble-chart"></div>'
            //templateUrl:
        };
    };
    app.directive('bubbleChart', directive);

}());