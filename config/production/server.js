'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    port: 8081,
    logger: {
        console: {
            level: 'verbose',
            colorize: true
        },
        file: {
            level: 'verbose',
            file: 'log/error.log'
        }
    }
};
