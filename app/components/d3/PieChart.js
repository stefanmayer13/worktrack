'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const d3 = require('d3');

const PieChart = {
    create(el, props, data) {
        const color = d3.scale.category20c();

        const svg = d3.select(el).append('svg:svg')
            .data([data])
            .attr('width', props.width)
            .attr('height', props.height)
            .append("svg:g")
            .attr("transform", "translate(" + props.radius + "," + props.radius + ")");

        const arc = d3.svg.arc()
            .outerRadius(props.radius);

        const pie = d3.layout.pie()
            .value((d) => {
                return d.duration;
            });

        const arcs = svg.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("svg:g")
            .attr("class", "slice");

        arcs.append("svg:path")
            .attr("fill", function(d, i) {
                return color(i);
            }) //set the color for each slice to be chosen from the color function defined above
            .attr("d", arc);

        arcs.append("svg:text")                                     //add a label to each slice
            .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = props.radius;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) {
                return data[i].key;
            });
    },

    destroy(el) {
        d3.select(el).select('svg').remove();
    }
};

module.exports = PieChart;
