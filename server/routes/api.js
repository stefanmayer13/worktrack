'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let token = require('../../token');
let Logger = require('../Logger');
let DateHelper = require('../utils/DateHelper');

module.exports = (server, prefix) => {
    server.route({
        method: 'GET',
        path: prefix+'/reports/details',
        handler(request, reply) {
            let start = request.query.start || DateHelper.getTogglDate(),
                end = request.query.end || DateHelper.getTogglDate(),
                url = '/reports/api/v2/details?since=' + start
                        + '&until=' + end + '&user_agent=worktrack&workspace_id=827413';

            let options = {
                hostname: 'toggl.com',
                port: '443',
                path: url,
                method: 'GET',
                auth: token + ':api_token',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

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

    server.route({
        method: 'GET',
        path: prefix+'/reports/weekly',
        handler(request, reply) {
            let options = {
                hostname: 'toggl.com',
                port: '443',
                path: '/reports/api/v2/weekly?user_agent=worktrack&workspace_id=827413',
                method: 'GET',
                auth: token + ':api_token',
                headers: {
                    'Content-Type': 'application/json'
                }
            };

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
