'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

var gulp = require('gulp');

require('babel/register');

function getTask(name) {
    return require('./tasks/' + name);
}

gulp.task('default', ['check', 'webpack', 'devserver', 'watch']);

gulp.task('devserver', getTask('server').rundevserver);

gulp.task('webpack', getTask('client').webpack);

gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('app/**/*.js', ['check', 'webpack']);
});

gulp.task('check', getTask('helper').check);

gulp.task('sass', getTask('sass').sass);
