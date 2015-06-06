'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const https = require('https');
const Logger = require('../Logger');
const authData = require('../../auth').jira;
const Rx = require('rx');
const Boom = require('boom');

module.exports = {

    login(payload) {
        return Rx.Observable.create((observer) => {
            if (!payload.username || !payload.password) {
                observer.onError(new Error('Problem with entry data'));
                observer.onCompleted();
                return;
            }

            let postData = JSON.stringify({
                "username": payload.username,
                "password": payload.password
            });

            let url = `/rest/auth/1/session`;

            let options = {
                hostname: 'jira-new.netconomy.net',
                port: '443',
                path: url,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            Logger.info('Handling login to Jira', payload.username);

            let req = https.request(options, (res) => {
                if (res.statusCode === 401) {
                    return observer.onError(Boom.unauthorized('Username or password wrong'));
                } else if (res.statusCode === 403) {
                    return observer.onError(Boom.forbidden('CAPTCHA required'));
                } else if (res.statusCode !== 200) {
                    return observer.onError(Boom.create(res.statusCode, res.statusMessage));
                }

                observer.onNext({
                    'setCookie': res.headers['set-cookie']
                });

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    observer.onNext(data);
                });
                res.on('end', () => {
                    observer.onCompleted();
                });
            });

            req.on('error', function(e) {
                Logger.error('problem with request: ' + e.message);
                observer.onError(e);
                observer.onCompleted();
            });
            req.write(postData);

            req.end();
        }).reduce((prev, current) => {
            if (current.setCookie) {
                prev.setCookie = current.setCookie;
            } else {
                prev.data += current;
            }
            return prev;
        }, {data: ''}).map((data) => {
            return {
                setCookie: data.setCookie,
                data: JSON.parse(data.data)
            };
        }).map((data) => {
            if (data.errorMessages) {
                console.log(data.errorMessages[0]);
                throw new Error(data.errorMessages[0]);
            }
            return data;
        });
    },

    getUserData() {
        return Rx.Observable.create((observer) => {
            let url = `/rest/auth/1/session`;

            let options = {
                hostname: 'jira-new.netconomy.net',
                port: '443',
                path: url,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            let req = https.request(options, (res) => {
                if (res.statusCode === 401) {
                    return observer.onError(Boom.unauthorized('Not logged in'));
                } else if (res.statusCode !== 200) {
                    return observer.onError(Boom.create(res.statusCode, res.statusMessage));
                }

                res.setEncoding('utf8');
                res.on('data', (data) => {
                    observer.onNext(data);
                });
                res.on('end', () => {
                    observer.onCompleted();
                });
            });

            req.on('error', function(e) {
                Logger.error('problem with request: ' + e.message);
                observer.onError(e);
                observer.onCompleted();
            });

            req.end();
        }).reduce((prev, current) => {
            return prev + current;
        }).map((data) => {
            return JSON.parse(data);
        }).map((data) => {
            if (data.errorMessages) {
                console.log(data.errorMessages[0]);
                throw new Error(data.errorMessages[0]);
            }
            return data;
        });
    },

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
        let duration = entry.dur || entry.duration;
        if (duration < 60000) {
            duration = 60000;
        }
        var auth = 'Basic ' + new Buffer(authData.user + ':' + authData.pass).toString('base64');
        let issueKey = entry.jira.key;
        let isoStartDateStr = new Date(entry.start).toISOString();
        let postData = JSON.stringify({
            "comment": entry.description,
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
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log(Buffer.byteLength(postData), postData.length, postData);

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
