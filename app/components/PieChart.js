'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const React = require('react/addons');

const D3PieChart = require('./d3/PieChart');

const PieChart = React.createClass({
    propTypes: {
        data: React.PropTypes.array
    },

    componentDidMount: function() {
        var el = this.getDOMNode();
        D3PieChart.create(el, {
            width: '100%',
            height: '300px',
            radius: 150
        }, this.getChartState());
    },

    componentDidUpdate: function() {
        var el = this.getDOMNode();
        D3PieChart.destroy(el);
        D3PieChart.create(el, {
            width: '100%',
            height: '300px',
            radius: 150
        }, this.getChartState());
    },

    getChartState: function() {
        return this.props.data;
    },

    componentWillUnmount: function() {
        var el = this.getDOMNode();
        D3PieChart.destroy(el);
    },

    render() {
        return (
            <div className="PieChart"></div>
        );
    }
});

module.exports = PieChart;
