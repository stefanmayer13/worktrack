'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');
var babel = require("gulp-babel");
var shell = require('gulp-shell');

require('babel/register');

function getTask(name) {
    return require('./tasks/' + name);
}

gulp.task('default', ['check', 'sass', 'devserver', 'watch']);

gulp.task('build', function (cb) {
    runSequence(['clean', 'check'],
        ['sass-production', 'client-prod'],
        ['server-prod', 'copy-resources'],
        cb);
});

gulp.task('devserver', getTask('server').rundevserver);

gulp.task('webpack', getTask('client').webpack);
gulp.task('webpackwatch', getTask('client').webpackwatch);
gulp.task('client-prod', getTask('client').webpackproduction);
gulp.task('server-prod', ['prod-conf', 'docker'], getTask('server').production);

gulp.task('watch', ['webpackwatch'], function () {
    gulp.watch('scss/*.scss', ['sass']);
});

gulp.task('check', getTask('helper').check);

gulp.task('sass', getTask('sass').sass);
gulp.task('sass-production', getTask('sass').sassproduction);

gulp.task('copy-resources', getTask('client').copyresources);

gulp.task('test', ['karma-tests', 'mocha-tests']);

gulp.task('karma-tests', getTask('testing').karmaTests);
gulp.task('mocha-tests', getTask('testing').mochaTests);

gulp.task('watch-test', function(done) {
    runSequence(
        ['watch-karma-tests', 'watch-mocha-tests'],
        done);
});

gulp.task('watch-karma-tests', getTask('testing').watchkarma);
gulp.task('watch-mocha-tests', function () {
    gulp.watch('server/**/*.js', ['mocha-tests']);
    gulp.watch('tests/server/**/*.js', ['mocha-tests']);
});

gulp.task('clean', function (cb) {
    del([
        'tmp',
        'build'
    ], cb);
});

gulp.task('prod-conf', function () {
    return gulp.src("app/Config.js")
        .pipe(babel())
        .pipe(gulp.dest("build/app"));
});

gulp.task('docker', function () {
    return gulp.src("Dockerfile")
        .pipe(gulp.dest("build"));
});

gulp.task('build-docker', shell.task([
    'docker build -t worktrack build'
]));
