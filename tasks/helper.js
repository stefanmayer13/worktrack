'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let gutil = require('gulp-util');
let eslint = require('eslint');

module.exports = {
    check() {
        gutil.log('running eslint');
        return gulp.src(['config/**/*.js', 'app/**/*.js', 'server/**/*.js', '__tests__/**/*.js', 'testutils/**/*.js'])
            .pipe(eslint({
                rulePaths: [
                    './'
                ]}))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
    }
}
