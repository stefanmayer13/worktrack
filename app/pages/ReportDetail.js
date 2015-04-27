'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Api = require('../utils/Api');
let Time = require('../utils/TimeHelper')

let ReportDetail = React.createClass({

    getInitialState() {
        return {};
    },

    componentWillMount() {
        Api.fetch('/api/reports/details?start=2015-04-24&end=2015-04-27')
            .subscribe((data) => {
                console.log(data);
                this.setState(data);
            });
    },

    render() {
        return (
            <div className='page'>
                <p>Total: {Time.getTime(this.state.total_grand)}</p>
            </div>
        );
    }
});

module.exports = ReportDetail;
