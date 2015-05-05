'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let React = require('react/addons');
let Time = require('../utils/TimeHelper');

let TimeEntry = React.createClass({

    propTypes: {
        entry: React.PropTypes.object
    },

    render() {
        let entry = this.props.entry,
            entryStyle = {
                'color': entry.project_color,
                'background-color': entry.project_hex_color
            },
            jiraInfo = entry.jira ? (
                <div>{entry.jira.key} {entry.jira.descr}</div>
            ) : null,
            logged = entry.jira.logged ? <div>Already logged!</div> : null;
        return (
            <li>
                <div>{entry.description}</div>
                <div style={entryStyle}>{entry.project}</div>
                {jiraInfo}
                <div>{Time.getTimeFromMs(entry.dur)}</div>
                <div>{Time.getTimeFromDateString(entry.start)} - {Time.getTimeFromDateString(entry.end)}</div>
                {logged}
            </li>
        );
    }
});

module.exports = TimeEntry;
