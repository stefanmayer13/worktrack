'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let gutil = require('gulp-util');
let eslint = require('gulp-eslint');
let gulp = require('gulp');

module.exports = {
    check() {
        gutil.log('running eslint');
        return gulp.src(['config/**/*.js', 'app/**/*.js', 'server/**/*.js', 'tests/**/*.js'])
            .pipe(eslint({
                rulePaths: [
                    './'
                ]}))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    }
};
