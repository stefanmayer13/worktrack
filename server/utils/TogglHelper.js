'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Q = require('q');
const https = require('https');
const async = require('async');

const Config = require('../Config');
const token = require('../../auth').token;
const Logger = require('../Logger');
const JiraHelper = require('../utils/JiraHelper');

module.exports = {
    getDetail(start, end) {
        let deferred = Q.defer();
        let url = `/reports/api/v2/details?since=${start}` +
                    `&until=${end}&user_agent=worktrack&workspace_id=${Config.toggl.workspace}`;

        let options = {
            hostname: 'toggl.com',
            port: '443',
            path: url,
            method: 'GET',
            auth: token + ':api_token',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        Logger.info('Handling request to toggle api', url);

        let req = https.request(options, (res) => {
            let body = '';
            res.setEncoding('utf8');
            res.on('data', (data) => {
                body += data;
            });
            res.on('end', () => {
                let data = JSON.parse(body);
                if (!data.data) {
                    return deferred.resolve(data);
                }
                let jiraCalls = data.data.map((entry) => {
                    return {
                        id: entry.id,
                        key: entry.description.split(' ')[0],
                        fn: JiraHelper.getIssue.bind(JiraHelper, entry.description.split(' ')[0])
                    };
                }).reduce((prev, curr) => {
                    prev[curr.id] = curr.fn;
                    return prev;
                }, {});
                async.parallelLimit(jiraCalls, 2, (err, jiraIssues) => {
                    if (err) {
                        return deferred.reject(err);
                    }
                    data.data = data.data.map((entry) => {
                        let jiraIssue = jiraIssues[entry.id];
                        if (jiraIssue) {
                            console.log('Issue ', jiraIssue.key);
                            entry.jira = {
                                id: jiraIssue.id,
                                key: jiraIssue.key,
                                descr: jiraIssue.fields.summary,
                                logged: JiraHelper.isLogged(entry, jiraIssue.fields.worklog)
                            };
                            entry.description = entry.description.substr(jiraIssue.key.length + 1);
                        }
                        return entry;
                    });
                    return deferred.resolve(data);
                });
            });
        });

        req.on('error', (e) => {
            Logger.error('problem with request: ' + e.message);
        });

        req.end();

        return deferred.promise;
    }
};
