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
        const url = 'mongodb://localhost:27017/worktrack';
        return Q.nfcall(MongoClient.connect, url);
    },

    getLogs(db, start, end) {
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59);
        const collection = db.collection('worklogs');
        const results = collection.find({start: {$gt: start}, end: {$lt: end}});
        return Q.nfcall(results.toArray.bind(results)).then((data) => {
            const total = data.reduce((subtotal, entry) => {
                return subtotal + entry.duration;
            }, 0);
            return {
                total: total,
                data: data
            };
        }, (err) => {
            console.log(err);
            return err;
        });
    },

    sync(db, entries) {
        const collection = db.collection('worklogs');
        console.log('Adding entries to DB', entries.length);
        const inserts = entries.map((entry) => {
            const dbEntry = {
                _id: entry.id,
                client: entry.client,
                project: entry.project,
                description: entry.description,
                start: new Date(entry.start),
                end: new Date(entry.end),
                duration: entry.dur,
                jira: entry.jira
            };

            return collection.updateOne.bind(collection, {
                _id: dbEntry._id
            }, dbEntry, {
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
