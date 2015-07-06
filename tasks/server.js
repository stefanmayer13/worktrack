'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const gutil = require("gulp-util");
const nodemon = require('nodemon');
const webpack = require('webpack');
const gulp = require('gulp');
const babel = require("gulp-babel");

const webpackServerProductionConfig = require("../webpack.server.production.config.js");

module.exports = {
    rundevserver() {
        nodemon({
            script: 'server/index.js',
            ext: 'js html',
            env: {'NODE_ENV': 'development'},
            nodeArgs: ['--debug'],
            ignore: ['.git', 'node_modules', 'app']
        }).on('restart', () => {
            gutil.log('server restarted!');
        });
    },

    production() {
        return gulp.src("server/**/*.js")
            .pipe(babel())
            .pipe(gulp.dest("build/server"));
    }
};
