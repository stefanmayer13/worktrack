'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let async = require('async');

let Logger = require('../Logger');
let DateHelper = require('../utils/DateHelper');
let JiraHelper = require('../utils/JiraHelper');
let TogglHelper = require('../utils/TogglHelper');
let token = require('../../auth').token;

module.exports = (server, db, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/reports/details',
        handler(request, reply) {
            let start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            TogglHelper.getDetail(start, end).then(reply, reply);
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

    server.route({
        method: 'GET',
        path: prefix+'/jira/issue/{issuekey}/worklog',
        handler(request, reply) {
            JiraHelper.getWorklogForIssue(request.params.issuekey, reply);
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/toggl/sync',
        handler(request, reply) {
            let start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            TogglHelper.getDetail(start, end).then((data) => {
                if (data && data.data) {
                    let collection = db.collection('toggl');
                    let inserts = data.data.map((entry) => {
                        return collection.insertOne.bind(collection, entry);
                    });
                    async.parallel(inserts, () => {
                        reply(`${inserts.length} entries added`);
                    });
                } else {
                    reply('No data');
                }
            }, reply);
        }
    });
};
