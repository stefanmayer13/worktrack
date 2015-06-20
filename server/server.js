'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let Hapi = require('hapi');
let Config = require('./Config');
let Logger = require('./Logger');
let MongoDBHelper = require('./utils/MongoDBHelper');

const sessionSecret = process.env.NODE_SESSION_SECRET;

MongoDBHelper.connect().then((db) => {
    let server = new Hapi.Server();
    server.connection({port: Config.port});

    server.auth.scheme('custom', require('./authScheme.js'));
    server.auth.strategy('default', 'custom');

    require('./routes/api')(server, db, '/api');
    require('./routes/app')(server);

    server.state('jiracookie', {
        isSecure: true,
        encoding: 'base64json'
    });

    server.register([{
        register: require('yar'),
        options: {
            cookieOptions: {
                password: sessionSecret,
                isSecure: false // as we are using HTTP only here.
            }
        }
    }], function(err) {
        if (err) {
            Logger.error(err);
            return;
        }
        server.start(function(e) {
            if (e) {
                Logger.error(e);
            } else {
                Logger.info('Server running at:', server.info.uri);
            }
        });
    });
}, (err) => {
    console.log('Error connecting DB!', err);
});
