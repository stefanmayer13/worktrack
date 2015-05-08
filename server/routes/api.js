'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let async = require('async');
let token = require('../../auth').token;
let Logger = require('../Logger');
let DateHelper = require('../utils/DateHelper');
let JiraHelper = require('../utils/JiraHelper');

module.exports = (server, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/reports/details',
        handler(request, reply) {
            let start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate(),
                url = '/reports/api/v2/details?since=' + start
                        + '&until=' + end + '&user_agent=worktrack&workspace_id=827413';

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

            Logger.info('Handling request to toggle api');

            let req = https.request(options, (res) => {
                let body = '';
                res.setEncoding('utf8');
                res.on('data', (data) => {
                    body += data;
                });
                res.on('end', () => {
                    let data = JSON.parse(body);
                    if (!data.data) {
                        return reply(data);
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
                            return reply(err);
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
                            }
                            return entry;
                        });
                        reply(data);
                    });
                });
            });

            req.on('error', (e) => {
                Logger.error('problem with request: ' + e.message);
            });

            req.end();
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/reports/weekly',
        handler(request, reply) {
            let options = {
                hostname: 'toggl.com',
                port: '443',
                path: '/reports/api/v2/weekly?user_agent=worktrack&workspace_id=827413',
                method: 'GET',
                auth: token + ':api_token',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            Logger.info('Handling request to toggle api');

            let req = https.request(options, (res) => {
                res.setEncoding('utf8');
                reply(res);
            });

            req.on('error', function(e) {
                Logger.error('problem with request: ' + e.message);
            });

            req.end();
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/jira/issue/{issuekey}',
        handler(request, reply) {
            JiraHelper.getIssue(request.params.issuekey, reply);
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/add',
        handler(request, reply) {
            let jiraRequests = request.payload.map((entry) => {
                return JiraHelper.add.bind(JiraHelper, entry);
            });
            async.series(jiraRequests, (err, data) => {
                console.log(err, data);
                reply(err, data);
            });
        }
    });
};
