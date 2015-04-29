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
                    <label for="startDate">From:</label>
                    <button onClick={this._onForwardStart}>+</button>
                    <input type="date" name="startDate" value={Time.getDateForApi(this.state.startDate)} onChange={this._handleDateChange} />
                    <button onClick={this._onBackwardStart}>-</button>
                </p>
                <p>
                    <label for="startDate">To:</label>
                    <button onClick={this._onForwardEnd}>+</button>
                    <input type="date" name="endDate" value={Time.getDateForApi(this.state.endDate)} onChange={this._handleDateChange} />
                    <button onClick={this._onBackwardEnd}>-</button>
                </p>
                {this.state.loading ? <p>Loading new data ...</p> : null}
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
        this.setState({
            loading: true
        });
        Api.fetch(`/api/reports/details?start=${Time.getDateForApi(state.startDate)}&end=${Time.getDateForApi(state.endDate)}`)
            .subscribe((data) => {
                console.log(data);
                data.loading = false;
                this.setState(data);
            });
    },

    _handleDateChange(e) {
        this.setState({
            [e.target.name]: new Date(e.target.value)
        });
    },

    _onForwardStart() {
        this._changeDate('startDate', +1);
    },

    _onBackwardStart() {
        this._changeDate('startDate', -1);
    },

    _onForwardEnd() {
        this._changeDate('endDate', +1);
    },

    _onBackwardEnd() {
        this._changeDate('endDate', -1);
    },

    _changeDate(datetype, dir) {
        let date = new Date(this.state[datetype]);
        date.setDate(date.getDate() + dir);
        this._setDate(datetype, date);
    },

    _setDate(datetype, date) {
        let startdate, enddate;
        if (datetype === 'startDate') {
            startdate = date;
            enddate = this.state.endDate;
            if (enddate < startdate) {
                enddate = new Date(startdate);
            }
        } else {
            startdate = this.state.startDate;
            enddate = date;
            if (enddate < startdate) {
                startdate = new Date(enddate);
            }
        }
        this.setState({
            startDate: startdate,
            endDate: enddate
        });
    }
});

module.exports = ReportDetail;