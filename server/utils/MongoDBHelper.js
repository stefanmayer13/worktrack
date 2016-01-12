'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const MongoClient = require('mongodb').MongoClient;
const Q = require('q');
const async = require('async');
const Rx = require('rx');

module.exports = {
    connect() {
        const mongoIp = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
        const mongoPort = process.env.MONGO_PORT_27017_TCP_PORT || '27017';
        const url = `mongodb://${mongoIp}:${mongoPort}/worktrack`;
        return Q.nfcall(MongoClient.connect, url);
    },

    setUserSession(db, username, session) {
        const collection = db.collection('users');
        return Rx.Observable.fromNodeCallback(collection.updateOne.bind(collection))({
            _id: username
        }, {
            $set: {
                session: session
            }
        }, {
            upsert: true
        });
    },

    setUserData(db, session, userdata) {
        const collection = db.collection('users');
        return Rx.Observable.fromNodeCallback(collection.updateOne.bind(collection))({
            session: session
        }, {
            $set: {
                togglApi: userdata.togglApi,
                togglWorkspace: userdata.togglWorkspace
            }
        });
    },

    getUserSession(db, session) {
        const collection = db.collection('users');
        return Rx.Observable.fromNodeCallback(collection.findOne.bind(collection))({session: session});
    },

    getLogs(db, start, end) {
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59);
        const collection = db.collection('worklogs');
        const results = collection.find({start: {$gt: start}, end: {$lt: end}}).sort({start: -1});
        return Q.nfcall(results.toArray.bind(results)).then((data) => {
            const total = data.reduce((subtotal, entry) => {
                return subtotal + entry.duration;
            }, 0);
            return {
                total: total,
                data: data
            };
        }).catch((err) => {
            console.log(err);
            throw err;
        });
    },

    sync(db, entries) {
        const collection = db.collection('worklogs');
        console.log('Adding entries to DB', entries.length);
        const inserts = entries
            .map((entry) => {
                return {
                    id: entry.id,
                    entry: {
                        client: entry.client,
                        project: entry.project,
                        description: entry.description,
                        start: new Date(entry.start),
                        end: new Date(entry.end),
                        duration: entry.dur,
                        jira: entry.jira
                    }
                };
            })
            .map((entry) => {
                return collection.updateOne.bind(collection, {
                    _id: entry.id
                }, {
                    $set: entry.entry
                }, {
                    upsert: true
                });
            });

        return Q.nfcall(async.parallel.bind(async, inserts));
    },

    getEntries(db, entryIds) {
        const collection = db.collection('worklogs');
        return Rx.Observable.fromNodeCallback(collection.find.bind(collection))({
            _id: {
                $in: entryIds
            }
        }).flatMap((result) => {
            return Rx.Observable.fromNodeCallback(result.toArray.bind(result))();
        }).flatMap((entries) => {
            return entries;
        });
    },

    addWorklog(db, entryId, worklogId) {
        const collection = db.collection('worklogs');
        console.log('Updating worklog for', entryId);

        return Rx.Observable.fromNodeCallback(collection.updateOne.bind(collection))({
            _id: entryId
        }, {
            $set: {
                worklog: worklogId
            }
        });
    }
};
