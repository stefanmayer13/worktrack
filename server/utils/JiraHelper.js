'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let Logger = require('../Logger');
let authData = require('../../auth').jira;

module.exports = {
    getIssue(issueKey, cb) {
        var auth = 'Basic ' + new Buffer(authData.user + ':' + authData.pass).toString('base64');

        let url = `/rest/api/2/issue/${issueKey}?fields=summary,worklog`;

        let options = {
            hostname: 'jira-new.netconomy.net',
            port: '443',
            path: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        };

        Logger.info('Handling request to Jira api', issueKey);

        let req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (data) => {
                body += data;
            });
            res.on('end', () => {
                let data = JSON.parse(body);
                if (data.errorMessages) {
                    cb(null, null);
                } else {
                    cb(null, data);
                }
            });
        });

        req.on('error', function(e) {
            Logger.error('problem with request: ' + e.message);
            cb(e);
        });

        req.end();
    },

    isLogged(entry, worklogData) {
        if (!worklogData || !worklogData.worklogs) {
            return false;
        }
        let worklogs = worklogData.worklogs,
            entryDate = new Date(entry.start),
            dur = Math.round(entry.dur / 60000) * 60;
        entryDate.setHours(0, 0, 0, 0);
        let entryDateTime = entryDate.getTime();
        let foundWorklog = worklogs.filter((worklog) => {
            let logDate = new Date(worklog.started);
            logDate.setHours(0, 0, 0, 0);
            if (entryDateTime === logDate.getTime()) {
                console.log(dur, worklog.timeSpentSeconds);
            }
            return (entryDateTime === logDate.getTime()) && (dur === worklog.timeSpentSeconds);
        });
        console.log(foundWorklog.length !== 0);
        return foundWorklog.length !== 0;
    }
};
