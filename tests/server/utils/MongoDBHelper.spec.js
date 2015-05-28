'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const rewire = require('rewire');
const expect = require('chai').expect;
const Q = require('q');
const MongoClient = require('mongodb').MongoClient;

const MongoDBHelper = rewire('../../../server/utils/MongoDBHelper');

const url = 'mongodb://localhost:27017/worktrack-test';

describe("MongoDBHelper", () => {
    describe("getLogs", () => {
        after(() => {
            return Q.nfcall(MongoClient.connect, url)
            .then((db) => {
                const collection = db.collection('worklogs');
                return Q.nfcall(collection.deleteOne.bind(collection), {
                    _id: 1
                });
            });
        });

        it("gets data from DB between start and end date", () => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('worklogs');
                    return Q.nfcall(collection.insertOne.bind(collection), {
                        _id: 1,
                        description: 'test',
                        start: new Date('01/02/2015'),
                        end: new Date('01/02/2015')
                    }).then(() => {
                        return db;
                    });
                })
                .then((db) => {
                    const start = new Date('01/01/2015');
                    const end = new Date('01/03/2015');

                    return MongoDBHelper.getLogs(db, start, end);
                })
                .then((result) => {
                    expect(result.data).to.have.length(1);
                    expect(result.data[0].description).to.be.equal('test');
                });
        });
    });
});
