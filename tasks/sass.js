'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let gulp = require('gulp');
let gutil = require("gulp-util");
let autoprefixer = require('gulp-autoprefixer');
let minifyCSS = require('gulp-minify-css');
let sass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');

module.exports = {
    sass() {
        gulp.src('./scss/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(sourcemaps.write())
            .on('error', function (err) {
                gutil.log(err.message);
            })
            .pipe(gulp.dest('css'));
    },

    sassproduction() {
        gulp.src('./scss/*.scss')
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(minifyCSS())
            .pipe(gulp.dest('build/css'));
    }
};
