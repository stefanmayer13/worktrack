'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Time = require('../utils/TimeHelper');

let TimeEntry = React.createClass({

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
                    ? <div className="log">Already logged!</div>
                    : (this.props.sync
                        ? <button className="log" onClick={this.props.sync.bind(null, this.props.entry)}>Sync</button>
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
