'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let Logger = require('../Logger');
let authData = require('../../auth').jira;
let Rx = require('rx');

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
            dur = Math.round(entry.dur / 60000) * 60,
            durMin = dur - 60,
            durMax = dur + 60;
        entryDate.setHours(0, 0, 0, 0);
        let entryDateTime = entryDate.getTime();
        let foundWorklog = worklogs.filter((worklog) => {
            let logDate = new Date(worklog.started);
            logDate.setHours(0, 0, 0, 0);
            if (entryDateTime === logDate.getTime()) {
                console.log('Worklog ', dur, worklog.timeSpentSeconds);
            }
            return (entryDateTime === logDate.getTime()) && durMin <= worklog.timeSpentSeconds
                && durMax >= worklog.timeSpentSeconds;
        });
        console.log(foundWorklog.length !== 0);
        return foundWorklog.length !== 0;
    },

    add(entry) {
        return Rx.Observable.fromNodeCallback(this.addCb)(entry);
    },

    addCb(entry, cb) {
        if (!entry || !entry.jira || !entry.jira.id) {
            return cb(new Error('Problem with entry data'));
        }
        const duration = entry.dur || entry.duration;
        var auth = 'Basic ' + new Buffer(authData.user + ':' + authData.pass).toString('base64');
        let issueKey = entry.jira.key;
        let isoStartDateStr = new Date(entry.start).toISOString();
        let postData = JSON.stringify({
            "comment": encodeURIComponent(entry.description),
            "started": isoStartDateStr.substr(0, isoStartDateStr.length - 1) + '+0100',
            "timeSpentSeconds": duration / 1000
        });

        let url = `/rest/api/2/issue/${issueKey}/worklog`;

        let options = {
            hostname: 'jira-new.netconomy.net',
            port: '443',
            path: url,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth,
                'Content-Length': postData.length
            }
        };

        Logger.info('Handling request to Jira api, adding worklog to ', issueKey);

        let req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (data) => {
                body += data;
            });
            res.on('end', () => {
                let data = JSON.parse(body);
                if (data.errorMessages) {
                    cb(new Error(data.errorMessages[0]), null);
                } else {
                    cb(null, data);
                }
            });
        });

        req.on('error', function(e) {
            Logger.error('problem with request: ' + e.message);
            cb(e);
        });
        req.write(postData);

        req.end();
    },

    getWorklogForIssue(issueKey, cb) {
        var auth = 'Basic ' + new Buffer(authData.user + ':' + authData.pass).toString('base64');

        let url = `/rest/api/2/issue/${issueKey}/worklog`;

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

        Logger.info('Handling worklog request to Jira api', issueKey);

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
    }
};
