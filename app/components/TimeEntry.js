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
            entryStyle = {
                'color': entry.project_color,
                'background-color': entry.project_hex_color
            },
            jiraInfo = hasJiraInfo ? (
                <div>{entry.jira.key} {entry.jira.descr}</div>
            ) : null,
            warning = !hasJiraInfo ? <div style={{'background-color': 'red'}}>NO JIRA ISSUE FOUND!</div> : null,
            logged = (hasJiraInfo && entry.jira.logged) ? <div>Already logged!</div> : <button onClick={this._handleSync}>Sync</button>;
        return (
            <li>
                {warning}
                <div>{entry.description}</div>
                <div style={entryStyle}>{entry.project}</div>
                {jiraInfo}
                <div>{Time.getTimeFromMs(entry.dur)}</div>
                <div>{Time.getTimeFromDateString(entry.start)} - {Time.getTimeFromDateString(entry.end)}</div>
                {logged}
            </li>
        );
    },

    _handleSync() {
        this.setState({
            loading: true
        });
        Api.fetch(`/api/jira/add`, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([this.props.entry])
        }).subscribe((data) => {
            console.log(data);
            this.setState({
                loading: false
            });
        });
    }
});

module.exports = TimeEntry;
