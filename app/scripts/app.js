'use strict';

/**
 * @ngdoc overview
 * @name asecApp
 * @description
 * # asecApp
 *
 * Main module of the application.
 */
angular
  .module('asecApp', [
    'ngMaterial'
]);

var svg, vis;

function initBubbles(){
    var diameter = 600;

    var bubbleWidth = parseInt(d3.select('#bubble-chart').style('width'), 10);
    var bubbleHeight = parseInt(d3.select('#bubble-chart').style('height'), 10);

    d3.select('svg').remove();

    svg = d3.select('#bubble-chart').append('svg')
        .attr('width', bubbleWidth)
        .attr('height', bubbleHeight);

    var bubble = d3.layout.pack()
        .size([bubbleWidth, bubbleHeight])
        .padding(3) // padding between adjacent circles
        .value(function(d) {return d.size;}) // new data will be loaded to bubble layout

    var data = {"countries_msg_vol": {
      "CA": 170, "US": 393, "CU": 9, "BR": 89, "MX": 192,"Other": 254
    }};

    var nodes = bubble.nodes(processData(data))
        .filter(function(d){ return !d.children });

    vis = svg.selectAll('circle').data(nodes, function(d){ return d.name });

    vis.enter().append('circle')
        .attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; })
        .attr('r', function(d) { return d.r; })
        .attr('class', function(d) { return d.className; });
}

function processData(data) {
    var obj = data.countries_msg_vol;
    var newDataSet = [];
    for(var prop in obj) {
        newDataSet.push({name: prop, className: prop.toLowerCase(), size: obj[prop]});
    }
    return {children: newDataSet};
}

function resize(){
    initBubbles();
}

d3.select(window).on('resize', resize);

initBubbles();
