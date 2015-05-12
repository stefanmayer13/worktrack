'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const https = require('https');
const async = require('async');

const Logger = require('../Logger');
const DateHelper = require('../utils/DateHelper');
const JiraHelper = require('../utils/JiraHelper');
const MongoDBHelper = require('../utils/MongoDBHelper');
const TogglHelper = require('../utils/TogglHelper');
const token = require('../../auth').token;

module.exports = (server, db, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/logs',
        handler(request, reply) {
            const start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            MongoDBHelper.getLogs(db, start, end).then(reply, reply);
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/reports/details',
        handler(request, reply) {
            const start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            TogglHelper.getDetail(start, end).then(reply, reply);
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
            const jiraRequests = request.payload.map((entry) => {
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
            const start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            TogglHelper.getDetail(start, end).then((data) => {
                if (data && data.data) {
                    MongoDBHelper.sync(db, data.data).then((inserts) => {
                        reply(`${inserts.length} entries added`);
                    }, reply);
                } else {
                    reply('No data');
                }
            }, reply);
        }
    });
};
