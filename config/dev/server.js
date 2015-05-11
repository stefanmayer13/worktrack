'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = {
    port: 8080,
    toggl: {
        workspace: '827413'
    },
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
