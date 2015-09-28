'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const async = require('async');
const Rx = require('rx');

const DateHelper = require('../utils/DateHelper');
const JiraHelper = require('../utils/JiraHelper');
const NodeJira = require('node-jira');
const MongoDBHelper = require('../utils/MongoDBHelper');
const TogglHelper = require('../utils/TogglHelper');
const Logger = require('../Logger');
const LoggerConfig = require('../Config').logger;

const nodeJira = new NodeJira({
    hostname: 'jira-new.netconomy.net',
    port: '443',
    logger: LoggerConfig
});

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
                const session = request.session.get('user');
                MongoDBHelper.getUserSession(db, session).subscribe((usersession) => {
                    TogglHelper.getDetail(session, usersession.togglApi, usersession.togglWorkspace, start, end)
                        .then(reply, reply);
                }, reply);
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
                        if (!entry.worklog) {
                            return JiraHelper.add(cookie, entry).flatMap((worklog) => {
                                if (entry && worklog) {
                                    return MongoDBHelper.addWorklog(db, entry._id, worklog.id);
                                }
                                return Rx.Observable.fromArray([]);
                            });
                        }
                        return Rx.Observable.fromArray([]);
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
                const session = request.session.get('user');
                MongoDBHelper.getUserSession(db, session).subscribe((usersession) => {
                    TogglHelper.getDetail(session, usersession.togglApi, usersession.togglWorkspace, start, end)
                    .then((data) => {
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
                }, reply);
            }
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/jira/login',
        handler(request, reply) {
            nodeJira.loginRx(request.payload.username, request.payload.password)
            .subscribe((data) => {
                MongoDBHelper.setUserSession(db, request.payload.username, data.cookie)
                .subscribe(() => {
                    const response = reply(data.data).hold();
                    request.session.set('user', data.cookie);
                    response.send();
                }, reply);
            }, reply);
        }
    });

    server.route({
        method: 'POST',
        path: prefix+'/user',
        handler(request, reply) {
            MongoDBHelper.setUserData(db, request.session.get('user'), request.payload)
                .subscribe(reply, reply);
        }
    });

    server.route({
        method: 'GET',
        path: prefix+'/jira/login',
        config: {
            auth: 'default',
            handler(request, reply) {
                const session = request.session.get('user');
                nodeJira.getUserDataRx(session)
                    .zip(MongoDBHelper.getUserSession(db, session),
                    (data, user) => {
                        return {
                            username: user._id,
                            togglApi: user.togglApi,
                            togglWorkspace: user.togglWorkspace,
                            url: data.self
                        };
                    })
                    .subscribe(reply, (err) => {
                        if (!err.isBoom) {
                            Logger.error(err);
                        }
                        reply(err);
                    });
            }
        }
    });

    server.route({
        method: 'DELETE',
        path: prefix+'/jira/login',
        config: {
            auth: 'default',
            handler(request, reply) {
                request.session.clear('user');
                reply({message: 'You have been logged out'});
            }
        }
    });
};
