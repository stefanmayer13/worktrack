'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let Hapi = require('hapi');
let Config = require('./Config');
let Logger = require('./Logger');
let MongoDBHelper = require('./utils/MongoDBHelper');

MongoDBHelper.connect().then((db) => {
    let server = new Hapi.Server();
    server.connection({port: Config.port});

    require('./routes/api')(server, db, '/api');
    require('./routes/app')(server);

    server.start(function () {
        Logger.info('Server running at:', server.info.uri);
    });
}, (err) => {
    console.log('Error connecting DB!', err);
});
