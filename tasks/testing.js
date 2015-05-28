'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const gulp = require('gulp');
const karma = require('karma').server;
const shell = require('gulp-shell');
//const coverage = require('gulp-coverage');

module.exports = {
    karmaTests(done) {
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
    },
    mochaTests: shell.task([
            'istanbul cover --report html --dir build/coverage/node --  ' +
                'node_modules/mocha/bin/_mocha --color --compilers js:babel/register tests/server/**/*.spec.js'
    ])
};
