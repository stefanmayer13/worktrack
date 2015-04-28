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
        let start = new Date(),
            end = new Date();
        start.setDate(start.getDate() - 1);
        return {
            data: [],
            startDate: start,
            endDate: end
        };
    },

    componentWillMount() {
        this._getNewData(this.state);
    },

    componentWillUpdate(nextProps, nextState) {
        if (nextState.startDate !== this.state.startDate || nextState.endDate !== this.state.endDate) {
            this._getNewData(nextState);
        }
    },

    render() {
        return (
            <div className='page'>
                <p>
                    <button onClick={this._onForward}>+</button>
                    <div>{Time.getDate(this.state.startDate)} - {Time.getDate(this.state.endDate)}</div>
                    <button onClick={this._onBackward}>-</button>
                </p>
                <p>Total: {Time.getTimeFromMs(this.state.total_grand)}</p>
                <ul>
                    {this.state.data.map((data) => {
                        return <TimeEntry key={data.id} entry={data} />;
                    })}
                </ul>
            </div>
        );
    },

    _getNewData(state) {
        Api.fetch(`/api/reports/details?start=${Time.getDateForApi(state.startDate)}&end=${Time.getDateForApi(state.endDate)}`)
            .subscribe((data) => {
                console.log(data);
                this.setState(data);
            });
    },

    _onForward() {
        this._changeDate(+1);
    },

    _onBackward() {
        this._changeDate(-1);
    },

    _changeDate(dir) {
        let start = new Date(this.state.startDate),
            end = new Date(this.state.endDate);
        start.setDate(start.getDate() + dir);
        end.setDate(end.getDate() +dir);
        this.setState({
            startDate: start,
            endDate: end
        });
    }
});

module.exports = ReportDetail;
