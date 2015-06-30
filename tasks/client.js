'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const webpack = require('webpack');
const gulp    = require('gulp');
const gutil   = require('gulp-util');
const nodemon = require('nodemon');
const path    = require('path');

const webpackConfig = require("../webpack.config.js");
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
            colors: true
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

    webpackwatch(cb) {
        webpack(webpackConfig).watch(100, afterBuild());
    }
};
