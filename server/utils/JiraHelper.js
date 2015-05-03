'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let https = require('https');
let Logger = require('../Logger');
let authData = require('../../auth').jira;

module.exports = {
    getIssue(issueKey, cb) {
        var auth = 'Basic ' + new Buffer(authData.user + ':' + authData.pass).toString('base64');

        let url = `/rest/api/2/issue/${issueKey}?fields=summary`;

        let options = {
            hostname: 'jira-new.netconomy.net',
            port: '443',
            path: url,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth
            }
        };

        Logger.info('Handling request to Jira api');

        let req = https.request(options, (res) => {
            res.setEncoding('utf8');
            cb(null, res);
        });

        req.on('error', function(e) {
            Logger.error('problem with request: ' + e.message);
            cb(e);
        });

        req.end();
    }
};
