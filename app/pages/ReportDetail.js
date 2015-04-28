'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Api = require('../utils/Api');
let Time = require('../utils/TimeHelper');
let TimeEntry = require('../components/TimeEntry');

let ReportDetail = React.createClass({

    getInitialState() {
        return {
            data: []
        };
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
                <p>Total: {Time.getTimeFromMs(this.state.total_grand)}</p>
                <ul>
                    {this.state.data.map((data) => {
                        return <TimeEntry key={data.id} entry={data} />;
                    })}
                </ul>
            </div>
        );
    }
});

module.exports = ReportDetail;
