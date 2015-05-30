'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Time = require('../utils/TimeHelper');
const Mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const RaisedButton = Mui.RaisedButton;

const TimeEntry = React.createClass({
    mixins: [MaterialUiMixin],

    getInitialState() {
        return {
            loading: false
        };
    },

    propTypes: {
        entry: React.PropTypes.object
    },

    render() {
        let entry = this.props.entry,
            hasJiraInfo = !!entry.jira,
            jiraInfo = hasJiraInfo ? (
                <div className="jira">{entry.jira.key} {entry.jira.descr}</div>
            ) : null,
            warning = !hasJiraInfo ? <div className="jiraerror">NO JIRA ISSUE FOUND!</div> : null,
            logged = (hasJiraInfo && (entry.jira.logged || entry.worklog))
                    ? <div className="log"><RaisedButton label="Logged" disabled={true} /></div>
                    : (this.props.sync
                        ? <div className="log"><RaisedButton
                            className="logbutton"
                            onClick={this.props.sync.bind(null, this.props.entry)}
                            label="Sync"/></div>
                        : null);
        return (
            <li className="timeentry">
                {logged}
                <div className="project">{entry.project}</div>
                {warning}
                {jiraInfo}
                <div className="descr">{entry.description}</div>
                <div className="duration">{Time.getTimeFromMs(entry.dur || entry.duration)}</div>
                <div className="time">
                    {Time.getTimeFromDateString(entry.start)} - {Time.getTimeFromDateString(entry.end)}
                </div>
            </li>
        );
    }
});

module.exports = TimeEntry;
