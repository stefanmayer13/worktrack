'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

var gulp = require('gulp');
var runSequence = require('run-sequence');
var del = require('del');

require('babel/register');

function getTask(name) {
    return require('./tasks/' + name);
}

gulp.task('default', ['check', 'sass', 'webpack', 'devserver', 'watch']);

gulp.task('build', function (cb) {
    runSequence(['clean', 'check'],
        ['sass-production', 'webpack-prod'],
        ['webpack-server', 'copy-resources'],
        cb);
});

gulp.task('devserver', getTask('server').rundevserver);

gulp.task('webpack', getTask('client').webpack);
gulp.task('webpackwatch', getTask('client').webpackwatch);
gulp.task('webpack-prod', getTask('client').webpackproduction);
gulp.task('webpack-server', getTask('server').webpackproduction);

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('app/**/*.js', ['webpack']);
});

gulp.task('check', getTask('helper').check);

gulp.task('sass', getTask('sass').sass);
gulp.task('sass-production', getTask('sass').sassproduction);

gulp.task('copy-resources', getTask('client').copyresources);

gulp.task('test', ['karmaTests', 'mochaTests']);

gulp.task('karmaTests', getTask('testing').karmaTests);
gulp.task('mochaTests', getTask('testing').mochaTests);

gulp.task('watch-test', getTask('testing').watchtest);

gulp.task('clean', function (cb) {
    del([
        'tmp',
        'build'
    ], cb);
});
