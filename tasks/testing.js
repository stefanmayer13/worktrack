'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const gulp = require('gulp');
const karma = require('karma').server;

const testFiles = './tests/**/*.js';

module.exports = {
    test(done) {
        karma.start({
            configFile: __dirname + '/../karma.conf.js',
            singleRun: true
        }, done);
    },
    watchtest(done) {
        karma.start({
            configFile: __dirname + '/../karma.conf.js',
            singleRun: false
        }, done);
    }
};
