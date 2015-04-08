'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let winston = require('winston');
let Config = require('./Config').logger;

let transports = [];

if (Config.console) {
    transports.push(
        new (winston.transports.Console)({
            level: (Config.console.level || 'error'),
            colorize: !!Config.console.colorize
        })
    );
}
if (Config.file) {
    transports.push(
        new (winston.transports.File)({
            level: (Config.console.level || 'error'),
            filename: Config.console.file || 'log/error.log'
        })
    );
}

module.exports = new (winston.Logger)({
    transports: transports
});
