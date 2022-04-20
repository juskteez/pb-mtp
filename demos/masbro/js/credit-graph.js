'use strict';

var dataset = [1, 1, 1, 1, 1, 1, 1, 1];

var colors = ['#6DC66A', '#2EB827', '#56DFE6', '#FFFFFF', '#FFFFFF', '#FF4A62', '#FF8696', '#FFC73E'];
var pieLabel = ['Psychometric', 'Jejak Sosial', 'Jejak Digital', '', '', 'KYC', 'Penghasilan / Kapasitas', 'Sejarah Kredit'];
var pieLabel_class = ['psychometric', 'jejak_sosial', 'jejak_digital', '', '', 'kyc', 'penghasilan_kapasitas', 'sejarah_kredit'];

var width = document.querySelector('.credit-graph').offsetWidth,
    height = document.querySelector('.credit-graph').offsetHeight,
    minOfWH = Math.min(width, height) / 2,
    initialAnimDelay   = 300,
    arcAnimDelay       = 150,
    arcAnimDur         = 2000,
    secDur             = 1000,
    secDelay           = 400,
    secIndividualdelay = 150;

var radius = undefined;

// calculate minimum of width and height to set chart radius
if (minOfWH > 426) {
  radius = 426;
} else {
  radius = minOfWH;
}

// append svg
var svg = d3.select('.credit-graph').append('svg').attr({
  'width': width,
  'height': height,
  'class': 'pieChart'
}).append('g');

svg.attr({
  'transform': 'translate(' + width / 2 + ', ' + height / 2 + ')'
});

// for drawing slices
var arc = d3.svg.arc().outerRadius(radius * 0.6).innerRadius(radius * 0.45);

// for labels and polylines
var outerArc = d3.svg.arc().innerRadius(radius * 0.75).outerRadius(radius * 0.65);

// d3 color generator
// let c10 = d3.scale.category10();

var pie = d3.layout.pie().value(function (d) {
  return d;
});

var draw = function draw() {

  svg.append("g").attr("class", "lines");
  svg.append("g").attr("class", "slices");
  svg.append("g").attr("class", "labels");

  // define slice
  var slice = svg.select('.slices').datum(dataset).selectAll('path').data(pie);
  slice.enter().append('path').attr({
    'fill': function fill(d, i) {
      return colors[i];
    },
    'd': arc,
    'stroke-width': '25px'
  }).attr('transform', function (d, i) {
    return 'rotate(-180, 0, 0)';
  }).style('opacity', 0).transition().delay(function (d, i) {
    return i * arcAnimDelay + initialAnimDelay;
  }).duration(arcAnimDur).ease('elastic').style('opacity', 1).attr('transform', 'rotate(0,0,0)');

  slice.transition().delay(function (d, i) {
    return arcAnimDur + i * secIndividualdelay;
  }).duration(secDur).attr('stroke-width', '16px');

  var midAngle = function midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  };

  var text = svg.select(".labels").selectAll("text").data(pie(dataset));

  text.enter().append('text').attr('dy', '0.35em').style("opacity", 0).style('fill', '#393F46').text(function (d, i) {
    return pieLabel[i];
  }).attr("class", function (d, i) {
    return pieLabel_class[i];
  }).attr('transform', function (d) {
    // calculate outerArc centroid for 'this' slice
    var pos = outerArc.centroid(d);
    // define left and right alignment of text labels 							
    pos[0] = radius * 1.15 * (midAngle(d) < Math.PI ? 1 : -1);
    return 'translate(' + pos + ')';
  }).style('text-anchor', function (d) {
    return midAngle(d) < Math.PI ? "start" : "end";
  }).transition().delay(function (d, i) {
    return arcAnimDur - secDelay + i * secIndividualdelay;
  }).duration(secDur).style('opacity', 1);

  var polyline = svg.select(".lines").selectAll("polyline").data(pie(dataset));

  polyline.enter().append("polyline").style("opacity", 1).style('stroke', function (d, i) {
    return colors[i];
  }).attr('points', function (d) {
    var pos = outerArc.centroid(d);
    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
    return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
  }).transition().duration(secDur).delay(function (d, i) {
    return arcAnimDur - secDelay - 100 + i * secIndividualdelay;
  }).attr('points', function (d) {
    var pos = outerArc.centroid(d);
    pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
    return [arc.centroid(d), outerArc.centroid(d), pos];
  });
};

/*draw();*/

var replay = function replay() {

  d3.selectAll('.slices').transition().ease('back').duration(500).delay(0).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();
  d3.selectAll('.lines').transition().ease('back').duration(500).delay(100).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();
  d3.selectAll('.labels').transition().ease('back').duration(500).delay(200).style('opacity', 0).attr('transform', 'translate(0, 250)').remove();

  setTimeout(draw, 800);
};

var go_off = function go_off() {

  d3.selectAll('.slices').transition().ease('back').duration(200).delay(0).style('opacity', 0).attr('transform', 'translate(0, 0)').remove();
  d3.selectAll('.lines').transition().ease('back').duration(200).delay(0).style('opacity', 0).attr('transform', 'translate(0, 0)').remove();
  d3.selectAll('.labels').transition().ease('back').duration(200).delay(0).style('opacity', 0).attr('transform', 'translate(0, 0)').remove();

};

$(document).ready(function() {
  $(window).scroll(function() {
    var scrTop     = $(window).scrollTop(),
        $cre_graph = $('.credit-graph');

    if ($cre_graph.length > 0) {
      var cre_off_top  = $cre_graph.offset().top - $(window).height(),
          cre_on_hand  = $cre_graph.offset().top - $(window).height() * 0.5,
          cre_off_hand = $cre_graph.offset().top - $(window).height() / 2;

      if (scrTop > cre_off_top) {
        draw();
      }

      //$cre_graph.attr('cre_on_hand',cre_on_hand).attr('cre_off_hand',cre_off_hand);

      /*if (scrTop < cre_off_hand && $cre_graph.hasClass('ready')) {
        $cre_graph.removeClass('active ready');
      }*/
      if (scrTop > cre_on_hand) {
        $cre_graph.addClass('active');
        /*if (scrTop > cre_off_hand) {
          $cre_graph.addClass('ready');
        }*/
      } else {
        $cre_graph.removeClass('active');
      }
    }
  });
});

/*var button = document.querySelector('button');*/