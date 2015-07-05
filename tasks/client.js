'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const webpack = require('webpack');
const gulp    = require('gulp');
const gutil   = require('gulp-util');
const nodemon = require('nodemon');
const path    = require('path');
const merge   = require('merge-stream');

const webpackConfig = require("../webpack.config.js");
const webpackProductionConfig = require("../webpack.production.config.js");
let cache = {};

if (process.env.NODE_ENV !== 'production') {
    webpackConfig.devtool = 'source-map';
    webpackConfig.debug = true;
    webpackConfig.cache = cache;
    //webpackConfig.noParse = [
    //    path.join(__dirname, 'node_modules', 'react'),
    //    path.join(__dirname, 'node_modules', 'material-ui')
    //];
}

const afterBuild = (cb) => {
    return function webpackOnBuild (err, stats) {
        if (err) {
            throw new gutil.PluginError("webpack:build-dev", err);
        }
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true,
            chunks: false
        }));
        if ((typeof cb) === 'function') {
            cb();
        }
    };
};

module.exports = {
    webpack(cb) {
        webpack(webpackConfig).run(afterBuild(cb));
    },

    webpackproduction(cb) {
        webpack(webpackProductionConfig).run(function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack:build-dev", err);
            }
            cb();
        });
    },

    webpackwatch(cb) {
        webpack(webpackConfig).watch(100, afterBuild());
        cb();
    },

    copyresources() {
        const config = gulp.src('./config/production/**/*.js', {base: './config/production'})
            .pipe(gulp.dest('./build/config/production/'));
        const css = gulp.src('./css/*', {base: './css'})
            .pipe(gulp.dest('./build/css/'));
        const packagejson = gulp.src('./package.json', {base: './'})
            .pipe(gulp.dest('./build/'));

        return merge(config, css, packagejson);
    }
};
