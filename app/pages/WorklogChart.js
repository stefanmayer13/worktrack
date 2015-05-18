'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Router = require('react-router');
let Link = Router.Link;

let Api = require('../utils/Api');
let Time = require('../utils/TimeHelper');
let PieChart = require('../components/PieChart');
let DateInput = require('../components/DateInput');

let WorklogChart = React.createClass({
    mixins: [Router.Navigation],

    getInitialState() {
        return {
            data: [],
            loading: false
        };
    },

    componentWillMount() {
        this._getNewData(Time.getDateFromParam(this.props.params.date));
    },

    componentWillReceiveProps(nextProps) {
        this._getNewData(Time.getDateFromParam(nextProps.params.date));
    },

    render() {
        let previous = Time.getDateFromParam(this.props.params.date);
        previous.setDate(previous.getDate() - 1);
        let next = Time.getDateFromParam(this.props.params.date);
        next.setDate(next.getDate() + 1);
        return (
            <div className='page report'>
                <Link to="/"><button>Back</button></Link>
                <p>
                    <label htmlFor="date">Date:</label>
                    <Link to={`/worklog/chart/${Time.getDateForApi(previous)}`}><button>-</button></Link>
                    <DateInput name="date"
                           value={Time.getDateFromParam(this.props.params.date)}
                           onSubmit={this._handleDateChange} />
                    <Link to={`/worklog/chart/${Time.getDateForApi(next)}`}><button>+</button></Link>
                </p>
                {this.state.loading ? <p>Loading new data ...</p> : null}
                <p>Total: {Time.getTimeFromMs(this.state.total)}</p>
                <PieChart data={this.state.data} />
            </div>
        );
    },

    _getNewData(date) {
        this.setState({
            loading: true
        });
        let apiDate = Time.getDateForApi(date);
        let params = `start=${apiDate}&end=${apiDate}`;
        Api.fetch(`/api/logs?${params}`)
            .subscribe((data) => {
                data.loading = false;
                this.setState(data);
            });
    },

    _handleDateChange(date) {
        this.replaceWith(`/worklog/${Time.getDateForApi(date)}`);
    }
});

module.exports = WorklogChart;
