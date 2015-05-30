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
        this._getNewData(Time.getDateFromParam(this.props.params.date));
    },

    componentWillReceiveProps(nextProps) {
        this._getNewData(Time.getDateFromParam(nextProps.params.date));
    },

    render() {
        const toSync = this.state.data.filter((entry) => {
            return !entry.worklog;
        });
        const previous = Time.getDateFromParam(this.props.params.date);
        previous.setDate(previous.getDate() - 1);
        const next = Time.getDateFromParam(this.props.params.date);
        next.setDate(next.getDate() + 1);
        return (
            <div className='page report'>
                <Link to="/"><RaisedButton label="Back" /></Link>
                <div style={{marginTop: '1rem'}}>
                    <Link to={`/worklog/${Time.getDateForApi(previous)}`}>
                        <RaisedButton style={{float: 'left'}} label="-" />
                    </Link>
                    <DatePicker
                        style={{float: 'left'}}
                        defaultDate={Time.getDateFromParam(this.props.params.date)}
                        autoOk={true}
                        onChange={this._handleDateChange} />
                    <Link to={`/worklog/${Time.getDateForApi(next)}`}>
                        <RaisedButton style={{float: 'left'}} label="+" />
                    </Link>
                    <div style={{clear: 'left'}}></div>
                </div>
                <p>Total: {Time.getTimeFromMs(this.state.total)}</p>
                <p><RaisedButton onClick={this._handleSync} label="Sync from Toggl" /></p>
                <p>{toSync.length > 0
                    ? <RaisedButton onClick={this._handleJiraSync.bind(this, toSync)} label="Sync to Jira" />
                    : null}
                </p>
                <ul>
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
            let message, update = false;
            if (data.success) {
                if (!data.success) {
                    message = 'No entries found.';
                } else if (!data.success.inserts && !data.success.updates) {
                    message = 'There were no changes.';
                } else {
                    update = true;
                    message = '';
                    if (data.success.inserts) {
                        message += `There were ${data.success.inserts} inserts`;
                    }
                    if (data.success.updates) {
                        if (message !== '') {
                            message += ' and ';
                        } else {
                            message += 'There were ';
                        }
                        message += `${data.success.updates} updates`;
                    }
                    message += '.';
                }
            } else {
                message = `There was a problem syncing your data: ${data}`;
            }
            if (update) {
                this._getNewData(Time.getDateFromParam(this.props.params.date));
            } else {
                this.setState({
                    loading: false
                });
            }
            alert(message);
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
