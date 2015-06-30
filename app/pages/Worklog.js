'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const connectToStores = require('fluxible/addons/connectToStores');
const FluxibleMixin = require('fluxible/addons/FluxibleMixin');
const Mui = require('material-ui');
const WorklogStore = require('../stores/WorklogStore');
const Api = require('../utils/Api');
const Time = require('../utils/TimeHelper');
const TimeEntry = require('../components/TimeEntry');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');
const WorklogSyncAction = require('../actions/WorklogSyncAction');
const JiraSyncAction = require('../actions/JiraSyncAction');
const GetWorklogAction = require('../actions/GetWorklogAction');
const UserStore = require('../stores/UserStore');

const RaisedButton = Mui.RaisedButton;
const DatePicker = Mui.DatePicker;
const Paper = Mui.Paper;
const Link = Router.Link;

const Worklog = React.createClass({
    mixins: [Router.Navigation, MaterialUiMixin, FluxibleMixin],

    componentWillMount() {
        let date = this.props.params ? this.props.params.date : null;
        this._getNewData(Time.getDateFromParam(date));
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.params && (!this.props.params || this.props.params.date !== nextProps.params.date)) {
            this._getNewData(Time.getDateFromParam(nextProps.params.date));
        }
    },

    render() {
        const toSync = this.props.data.filter((entry) => {
            return !entry.worklog;
        });
        let date = Time.getDateFromParam(this.props.params ? this.props.params.date : null);
        const previous = new Date(date.getTime());
        previous.setDate(previous.getDate() - 1);
        const next = new Date(date.getTime());
        next.setDate(next.getDate() + 1);

        const togglEnabled = this.props.user && this.props.user.togglApi;

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
                    <p>Total: {Time.getTimeFromMs(this.props.total)}</p>
                </Paper>
                {togglEnabled ? <p><RaisedButton onClick={this._handleSync} label="Sync from Toggl" /></p> : null}
                <p>{this.props.loading ? 'loading...' : null}</p>
                <p>{toSync.length > 0
                    ? <RaisedButton onClick={this._handleJiraSync.bind(this, toSync)} label="Sync to Jira" />
                    : null}
                </p>
                <ul className="entrylist">
                    {this.props.data.map((data) => {
                        return <TimeEntry key={data._id} entry={data} sync={this._handleSingleSync} />;
                    })}
                </ul>
            </div>
        );
    },

    _getNewData(date) {
        this.executeAction(GetWorklogAction, date);
    },

    _handleDateChange(e, date) {
        this.replaceWith(`/worklog/${Time.getDateForApi(date)}`);
    },

    _handleSync() {
        this.executeAction(WorklogSyncAction, this.props.params.date);
    },

    _handleJiraSync(entries) {
        const entryIds = entries.map((entry) => {
            return entry._id;
        });
        this.executeAction(JiraSyncAction, {
            date: this.props.params.date,
            entries: entryIds
        });
    },

    _handleSingleSync(entry) {
        this._handleJiraSync([entry]);
    }
});

module.exports = connectToStores(Worklog, [WorklogStore, UserStore], function (stores) {
    return {
        data: stores.WorklogStore.getWorklogs(),
        total: stores.WorklogStore.getTotal(),
        error: stores.WorklogStore.getError(),
        loading: stores.WorklogStore.isLoading(),
        user: stores.UserStore.getCurrentUser()
    };
});
