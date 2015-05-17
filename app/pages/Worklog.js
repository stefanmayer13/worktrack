'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Router = require('react-router');
let Link = Router.Link;

let Api = require('../utils/Api');
let Time = require('../utils/TimeHelper');
let TimeEntry = require('../components/TimeEntry');
let DateInput = require('../components/DateInput');

let Worklog = React.createClass({
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
        let toSync = this.state.data.filter((entry) => {
            return !entry.worklog;
        });
        let previous = Time.getDateFromParam(this.props.params.date);
        previous.setDate(previous.getDate() - 1);
        let next = Time.getDateFromParam(this.props.params.date);
        next.setDate(next.getDate() + 1);
        return (
            <div className='page report'>
                <Link to="/"><button>Back</button></Link>
                <p>
                    <label htmlFor="date">Date:</label>
                    <Link to={`/worklog/${Time.getDateForApi(previous)}`}><button>-</button></Link>
                    <DateInput name="date"
                           value={Time.getDateFromParam(this.props.params.date)}
                           onSubmit={this._handleDateChange} />
                    <Link to={`/worklog/${Time.getDateForApi(next)}`}><button>+</button></Link>
                </p>
                {this.state.loading ? <p>Loading new data ...</p> : null}
                <p>Total: {Time.getTimeFromMs(this.state.total)}</p>
                <p><button onClick={this._handleSync}>Sync from Toggl</button></p>
                {toSync.length > 0
                    ? <p><button onClick={this._handleJiraSync.bind(this, toSync)}>Sync to Jira</button></p>
                    : null}
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
    },

    _handleSync() {
        this.setState({
            loading: true
        });
        let params = `start=${Time.getDateForApi(this.props.params.date)}`
                    + `&end=${Time.getDateForApi(this.props.params.date)}`;
        Api.fetch(`/api/toggl/sync?${params}`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).subscribe((data) => {
            let message, update = false;
            if (data.success) {
                if (!data.success.entries) {
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
                this._getNewData(this.state);
            }
            alert(message);
        });
    },

    _handleJiraSync(entries) {
        let entryIds = entries.map((entry) => {
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
            this._getNewData(this.state);
        });
    },

    _handleSingleSync(entry) {
        this._handleJiraSync([entry]);
    }
});

module.exports = Worklog;
