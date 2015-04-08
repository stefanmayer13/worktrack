'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

var gulp = require('gulp');

require('babel/register');

gulp.task('default', ['devserver']);

gulp.task('devserver', getTask('server').rundevserver);

function getTask(name) {
    return require('./tasks/' + name);
}
