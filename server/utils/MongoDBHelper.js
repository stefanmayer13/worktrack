'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let MongoClient = require('mongodb').MongoClient;
let Q = require('q');

module.exports = {
    connect() {
        let url = 'mongodb://localhost:27017/worktrack';
        return Q.nfcall(MongoClient.connect, url);
    }
};
