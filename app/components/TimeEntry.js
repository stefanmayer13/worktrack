'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Time = require('../utils/TimeHelper');
let Api = require('../utils/Api');

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
            warning = !hasJiraInfo ? <div style={{'backgroundColor': 'red'}}>NO JIRA ISSUE FOUND!</div> : null,
            logged = (hasJiraInfo && (entry.jira.logged || entry.worklog))
                        ? <div className="logged">Already logged!</div>
                        : this.props.sync ? <button onClick={this.props.sync.bind(null, this.props.entry)}>Sync</button> : null;
        return (
            <li className="timeentry">
                {warning}
                <div className="project">{entry.project}</div>
                {jiraInfo}
                <div className="descr">{entry.description}</div>
                <div className="duration">{Time.getTimeFromMs(entry.dur || entry.duration)}</div>
                <div className="time">
                    {Time.getTimeFromDateString(entry.start)} - {Time.getTimeFromDateString(entry.end)}
                </div>
                {logged}
            </li>
        );
    }
});

module.exports = TimeEntry;
