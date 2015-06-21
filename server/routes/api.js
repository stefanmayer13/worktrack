'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const async = require('async');

const DateHelper = require('../utils/DateHelper');
const JiraHelper = require('../utils/JiraHelper');
const MongoDBHelper = require('../utils/MongoDBHelper');
const TogglHelper = require('../utils/TogglHelper');
const Logger = require('../Logger');

module.exports = (server, db, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/logs',
        config: {
            auth: 'default',
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
                console.log(`Getting logs for ${start} to ${end}.`);
                MongoDBHelper.getLogs(db, start, end).then(reply, reply);
            }
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/reports/details',
        config: {
            auth: 'default',
            handler(request, reply) {
                const start = request.query.start || DateHelper.getTogglDate(),
                    end = request.query.end || DateHelper.getTogglDate();
                TogglHelper.getDetail(request.session.get('user'), start, end).then(reply, reply);
            }
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/jira/issue/{issuekey}',
        config: {
            auth: 'default',
            handler(request, reply) {
                JiraHelper.getIssue(request.session.get('user'), request.params.issuekey, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/toggl/add',
        config: {
            auth: 'default',
            handler(request, reply) {
                const jiraRequests = request.payload.map((entry) => {
                    return JiraHelper.addCb.bind(JiraHelper, request.session.get('user'), entry);
                });
                async.series(jiraRequests, (err, data) => {
                    console.log(err, data);
                    reply(err, data);
                });
            }
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/add',
        config: {
            auth: 'default',
            handler(request, reply) {
                const cookie = request.session.get('user');
                console.log(cookie);
                MongoDBHelper.getEntries(db, request.payload)
                    .flatMap((entry) => {
                        return JiraHelper.add(cookie, entry).flatMap((worklog) => {
                            return MongoDBHelper.addWorklog(db, entry._id, worklog.id);
                        });
                    })
                    .toArray()
                    .subscribe((err, data) => {
                        reply(err, data);
                    });
            }
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/jira/issue/{issuekey}/worklog',
        config: {
            auth: 'default',
            handler(request, reply) {
                JiraHelper.getWorklogForIssue(request.params.issuekey, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/toggl/sync',
        config: {
            auth: 'default',
            handler(request, reply) {
                const start = request.query.start || DateHelper.getTogglDate(),
                    end = request.query.end || DateHelper.getTogglDate();
                console.log(start, end);
                TogglHelper.getDetail(request.session.get('user'), start, end).then((data) => {
                    if (data && data.data) {
                        MongoDBHelper.sync(db, data.data).then((entries) => {
                            let inserts = entries.filter((entry) => {
                                return !!entry.upsertedCount;
                            });
                            reply({
                                success: {
                                    inserts: inserts.length,
                                    updates: entries.length - inserts.length
                                }
                            });
                        }, (err) => {
                            console.log(err);
                            reply(err);
                        });
                    } else {
                        reply('No data');
                    }
                }, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/login',
        handler(request, reply) {
            JiraHelper.login(request.payload)
            .subscribe((data) => {
                const response = reply(data.data).hold();
                request.session.set('user', data.setCookie);
                response.send();
            }, reply);
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/jira/login',
        config: {
            auth: 'default',
            handler(request, reply) {
                JiraHelper.getUserData(request.session.get('user'))
                    .subscribe(reply, (err) => {
                        if (!err.isBoom) {
                            Logger.error(err);
                        }
                        reply(err);
                    });
            }
        }
    });
};
