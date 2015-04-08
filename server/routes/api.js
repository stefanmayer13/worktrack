'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let token = require('../../token');
let Logger = require('../Logger');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/',
        handler(request, reply) {
            Logger.pr
            let options = {
                hostname: 'toggl.com',
                port: '443',
                path: '/reports/api/v2/weekly?user_agent=worktrack&workspace_id=827413',
                method: 'GET',
                auth: token + ':api_token',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            Logger.info('Handling request to toggle api');

            let req = https.request(options, (res) => {
                res.setEncoding('utf8');
                reply(res);
            });

            req.on('error', function(e) {
                Logger.error('problem with request: ' + e.message);
            });

            req.end();
        }
    });
};