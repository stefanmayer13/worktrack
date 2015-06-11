'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const Mui = require('material-ui');
const Api = require('../utils/Api');
const Time = require('../utils/TimeHelper');
const TimeEntry = require('../components/TimeEntry');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const RaisedButton = Mui.RaisedButton;
const DatePicker = Mui.DatePicker;
const Paper = Mui.Paper;
const Link = Router.Link;

const Worklog = React.createClass({
    mixins: [Router.Navigation, MaterialUiMixin],

    getInitialState() {
        return {
            data: [],
            loading: false
        };
    },

    componentWillMount() {
        let date = this.props.params ? this.props.params.date : null;
        this._getNewData(Time.getDateFromParam(date));
    },

    componentWillReceiveProps(nextProps) {
        let date = nextProps.params ? nextProps.params.date : null;
        this._getNewData(Time.getDateFromParam(date));
    },

    render() {
        const toSync = this.state.data.filter((entry) => {
            return !entry.worklog;
        });
        let date = Time.getDateFromParam(this.props.params ? this.props.params.date : null);
        const previous = new Date(date.getTime());
        previous.setDate(previous.getDate() - 1);
        const next = new Date(date.getTime());
        next.setDate(next.getDate() + 1);

        return (
            <div className='page report'>
                <div className="backbutton">
                    <Link to="/"><RaisedButton label="Back" /></Link>
                </div>
                <div style={{marginTop: '1rem', marginBottom: '1rem'}}>
                    <Link to={`/worklog/${Time.getDateForApi(previous)}`}>
                        <RaisedButton style={{float: 'left'}} label="-" />
                    </Link>
                    <DatePicker
                        className="datepicker"
                        style={{float: 'left'}}
                        defaultDate={date}
                        autoOk={true}
                        formatDate={Time.getDate.bind(Time)}
                        onChange={this._handleDateChange} />
                    <Link to={`/worklog/${Time.getDateForApi(next)}`}>
                        <RaisedButton style={{float: 'left'}} label="+" />
                    </Link>
                    <div style={{clear: 'left'}}></div>
                </div>
                <Paper zDepth={2} style={{display: 'inline-block', padding: '0 1rem'}}>
                    <p>Total: {Time.getTimeFromMs(this.state.total)}</p>
                </Paper>
                <p><RaisedButton onClick={this._handleSync} label="Sync from Toggl" /></p>
                <p>{this.state.loading ? 'loading...' : null}</p>
                <p>{toSync.length > 0
                    ? <RaisedButton onClick={this._handleJiraSync.bind(this, toSync)} label="Sync to Jira" />
                    : null}
                </p>
                <ul className="entrylist">
                    {this.state.data.map((data) => {
                        return <TimeEntry key={data._id} entry={data} sync={this._handleSingleSync} />;
                    })}
                </ul>
            </div>
        );
    },

    _getNewData(date) {
        this.setState({
            loading: true
        });
        const apiDate = Time.getDateForApi(date);
        const params = `start=${apiDate}&end=${apiDate}`;
        Api.fetch(`/api/logs?${params}`)
            .subscribe((data) => {
                data.loading = false;
                this.setState(data);
            });
    },

    _handleDateChange(e, date) {
        this.replaceWith(`/worklog/${Time.getDateForApi(date)}`);
    },

    _handleSync() {
        this.setState({
            loading: true
        });
        const date = Time.getDateFromParam(this.props.params.date);
        const params = `start=${Time.getDateForApi(date)}`
                    + `&end=${Time.getDateForApi(date)}`;
        Api.fetch(`/api/toggl/sync?${params}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).subscribe((data) => {
            if (data.success) {
                this._getNewData(Time.getDateFromParam(this.props.params.date));
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    },

    _handleJiraSync(entries) {
        const entryIds = entries.map((entry) => {
            return entry._id;
        });
        Api.fetch(`/api/jira/add`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entryIds)
        }).subscribe(() => {
            this._getNewData(Time.getDateFromParam(this.props.params.date));
        });
    },

    _handleSingleSync(entry) {
        this._handleJiraSync([entry]);
    }
});

module.exports = Worklog;
