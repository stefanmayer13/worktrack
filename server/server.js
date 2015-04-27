'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let Hapi = require('hapi');
let Config = require('./Config');
let Logger = require('./Logger');

var server = new Hapi.Server();
server.connection({port: Config.port});

require('./routes/api')(server, '/api');
require('./routes/app')(server);

server.start(function () {
    Logger.info('Server running at:', server.info.uri);
});
