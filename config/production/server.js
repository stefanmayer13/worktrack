'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    baseUrl: '',
    port: 8081,
    logger: {
        console: {
            level: 'verbose',
            colorize: true
        },
        file: {
            level: 'error',
            file: 'log/error.log'
        }
    }
};
