'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const MongoClient = require('mongodb').MongoClient;
const Q = require('q');

module.exports = {
    connect() {
        const url = 'mongodb://localhost:27017/worktrack';
        return Q.nfcall(MongoClient.connect, url);
    },

    getLogs(db, start, end) {
        const collection = db.collection('worklogs');
        const results = collection.find({});
        return Q.nfcall(results.toArray.bind(results)).then((data) => {
            const total = data.reduce((subtotal, entry) => {
                return subtotal + entry.dur;
            }, 0);
            return {
                total: total,
                data: data
            }
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
            console.log('Inserting data into db', dbEntry);
            return collection.insertOne.bind(collection, dbEntry);
        });
        return Q.nfcall(async.parallel.bind(async, inserts));
    }
};
