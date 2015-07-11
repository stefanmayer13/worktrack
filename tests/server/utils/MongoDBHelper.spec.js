'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
const rewire = require('rewire');
const Q = require('q');
const MongoClient = require('mongodb').MongoClient;
const Rx = require('rx');

const MongoDBHelper = rewire('../../../server/utils/MongoDBHelper');

chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const url = 'mongodb://localhost:27017/worktrack-test';

MongoDBHelper.__set__({
    console: {
        log() {}
    }
});

describe("MongoDBHelper", () => {
    describe("getLogs", () => {
        before(() => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('worklogs');
                    return Q.nfcall(collection.insertMany.bind(collection), [{
                        _id: 1,
                        description: 'test1',
                        start: new Date('01/02/2015'),
                        end: new Date('01/02/2015'),
                        duration: 2
                    }, {
                        _id: 2,
                        description: 'test2',
                        start: new Date('01/02/2015'),
                        end: new Date('01/02/2015'),
                        duration: 2
                    }, {
                        _id: 3,
                        description: 'test3',
                        start: new Date('01/04/2015'),
                        end: new Date('01/04/2015'),
                        duration: 3
                    }]);
                });
        });

        after(() => {
            return Q.nfcall(MongoClient.connect, url)
            .then((db) => {
                const collection = db.collection('worklogs');
                return Q.nfcall(collection.deleteMany.bind(collection), {});
            });
        });

        it("gets data from DB between start and end date", () => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const start = new Date('01/01/2015');
                    const end = new Date('01/03/2015');

                    return MongoDBHelper.getLogs(db, start, end);
                })
                .then((result) => {
                    expect(result.data).to.have.length(2);
                    expect(result.data[0].duration).to.be.equal(2);
                });
        });

        it("calculates total for the query", () => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const start = new Date('01/01/2015');
                    const end = new Date('01/03/2015');

                    return MongoDBHelper.getLogs(db, start, end);
                })
                .then((result) => {
                    expect(result.total).to.be.equal(4);
                });
        });

        it("should return errors", () => {
            const start = new Date('01/01/2015');
            const end = new Date('01/03/2015');

            const dbMock = {
                collection() {
                    return {
                        find() {
                            return {
                                sort() {
                                    return {
                                        toArray(c) {
                                            c(new Error('error'));
                                        }
                                    };
                                }
                            };
                        }
                    };
                }
            };

            return assert.isRejected(MongoDBHelper.getLogs(dbMock, start, end), 'error');
        });
    });

    describe("getUserSession", () => {
        const userSession1 = {
            _id: 'testuser1',
            session: 'abc',
            data: 'test1'
        };
        const userSession2 = {
            _id: 'testuser2',
            session: 'testsession',
            data: 'test2'
        };
        before(() => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('users');
                    return Q.nfcall(collection.insertMany.bind(collection), [userSession1, userSession2]);
                });
        });

        after(() => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('users');
                    return Q.nfcall(collection.deleteMany.bind(collection), {});
                });
        });

        it("gets userdata if session is present", (done) => {
            Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    Rx.Observable.zipArray(
                        MongoDBHelper.getUserSession(db, userSession1.session),
                        MongoDBHelper.getUserSession(db, userSession2.session)
                    ).subscribe((result) => {
                        expect(result[0]).to.be.deep.equal(userSession1);
                        expect(result[1]).to.be.deep.equal(userSession2);
                        done();
                    }, (err) => {
                        expect(err).to.be.not.defined;
                        done();
                    });
                });
        });

        it("return null if session is not found", (done) => {
            Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    MongoDBHelper.getUserSession(db, '123').subscribe((result) => {
                        expect(result).to.be.equal(null);
                        done();
                    }, (err) => {
                        expect(err).to.not.be.defined;
                        done();
                    });
                });
        });
    });

    describe("setUserSession", () => {
        const userSession1 = {
            _id: 'testuser1',
            session: 'abc'
        };
        const userSession2 = {
            _id: 'testuser2',
            session: 'testsession',
            data: 'test2'
        };
        const userSession3 = {
            _id: 'testuser2',
            session: 'testsessionnew',
            data: 'test2'
        };

        before(() => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('users');
                    return Q.nfcall(collection.insertMany.bind(collection), [userSession2]);
                });
        });

        after(() => {
            return Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    const collection = db.collection('users');
                    return Q.nfcall(collection.deleteMany.bind(collection), {});
                });
        });

        it("should store usersession", (done) => {
            Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    MongoDBHelper.setUserSession(db, userSession1._id, userSession1.session).do((result) => {
                        expect(result.result.ok).to.be.equal(1);
                    }, (err) => {
                        expect(err).to.not.be.defined;
                    }).flatMap(() => {
                        return MongoDBHelper.getUserSession(db, userSession1.session);
                    }).subscribe((result) => {
                        expect(result).to.be.deep.equal(userSession1);
                        done();
                    }, (err) => {
                        expect(err).to.be.not.defined;
                        done();
                    });
                });
        });

        it("should not override present usersession data except session", (done) => {
            Q.nfcall(MongoClient.connect, url)
                .then((db) => {
                    MongoDBHelper.getUserSession(db, userSession2.session)
                    .do((result) => {
                        expect(result).to.be.deep.equal(userSession2); //Check precondition
                    }, (err) => {
                        expect(err).to.not.be.defined;
                    }).flatMap(() => {
                        return MongoDBHelper.setUserSession(db, userSession2._id, userSession3.session);
                    }).do((result) => {
                        expect(result.result.ok).to.be.equal(1);
                    }, (err) => {
                        expect(err).to.not.be.defined;
                    }).flatMap(() => {
                        return MongoDBHelper.getUserSession(db, userSession3.session);
                    }).subscribe((result) => {
                        expect(result).to.be.deep.equal(userSession3);
                        done();
                    }, (err) => {
                        expect(err).to.be.not.defined;
                        done();
                    });
                });
        });
    });
});
