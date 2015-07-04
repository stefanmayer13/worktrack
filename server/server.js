'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Hapi = require('hapi');
const Config = require('./Config');
const Logger = require('./Logger');
const MongoDBHelper = require('./utils/MongoDBHelper');

const sessionSecret = process.env.NODE_SESSION_SECRET;

Logger.verbose('Connecting to MongoDB');

MongoDBHelper.connect().then((db) => {
    Logger.verbose('Connected.');
    let server = new Hapi.Server();
    server.connection({port: Config.port});

    server.auth.scheme('custom', require('./authScheme.js'));
    server.auth.strategy('default', 'custom');

    require('./routes/api')(server, db, Config.baseUrl + '/api');
    require('./routes/app')(server);

    server.state('jiracookie', {
        isSecure: true,
        encoding: 'base64json'
    });

    Logger.verbose('Registering plugins');

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
}).catch((err) => {
    Logger.error(err);
});
