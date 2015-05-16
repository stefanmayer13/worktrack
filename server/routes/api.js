'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const async = require('async');

const DateHelper = require('../utils/DateHelper');
const JiraHelper = require('../utils/JiraHelper');
const MongoDBHelper = require('../utils/MongoDBHelper');
const TogglHelper = require('../utils/TogglHelper');

module.exports = (server, db, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/logs',
        handler(request, reply) {
            let start = request.query.start,
                end = request.query.end;
            if (isNaN(Date.parse(start))) {
                start = new Date();
            } else {
                start = new Date(start);
            }
            if (isNaN(Date.parse(end))) {
                end = new Date();
            } else {
                end = new Date(end);
            }
            if (start > end) {
                start = end;
            }
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
        path: prefix+'/jira/toggl/add',
        handler(request, reply) {
            const jiraRequests = request.payload.map((entry) => {
                return JiraHelper.addCb.bind(JiraHelper, entry);
            });
            async.series(jiraRequests, (err, data) => {
                console.log(err, data);
                reply(err, data);
            });
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/add',
        handler(request, reply) {
            MongoDBHelper.getEntries(db, request.payload)
            .flatMap((entry) => {
                return JiraHelper.add(entry).flatMap((worklog) => {
                    return MongoDBHelper.addWorklog(db, entry._id, worklog.id);
                });
            })
            .toArray()
            .subscribe((err, data) => {
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
        method: 'POST',
        path: prefix+'/toggl/sync',
        handler(request, reply) {
            const start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate();
            console.log(start, end);
            TogglHelper.getDetail(start, end).then((data) => {
                if (data && data.data) {
                    MongoDBHelper.sync(db, data.data).then((entries) => {
                        let updates = entries.filter((entry) => {
                            return !!entry.modifiedCount;
                        });
                        let inserts = entries.filter((entry) => {
                            return !!entry.upsertedCount;
                        });
                        reply({
                            success: {
                                inserts: inserts.length,
                                updates: updates.length,
                                entries: entries.length
                            }
                        });
                    }, reply);
                } else {
                    reply('No data');
                }
            }, reply);
        }
    });
};
