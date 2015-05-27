'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const gulp = require('gulp');
const karma = require('karma').server;
const mocha = require('gulp-mocha');
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
    mochaTests() {
        return gulp.src('tests/server/**/*.js', {read: false})
            //.pipe(coverage.instrument({
            //    pattern: ['**/*.spec.js'],
            //    debugDirectory: 'debug'
            //}))
            .pipe(mocha({reporter: 'spec'}))
            //.pipe(coverage.gather())
            //.pipe(coverage.format())
            //.pipe(gulp.dest('build/coverage/node'))
            .once('error', function () {
                process.exit(1);
            })
            .once('end', function () {
                process.exit();
            });
    }
};
