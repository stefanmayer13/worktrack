'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let gutil = require("gulp-util");
let nodemon = require('nodemon');
const webpack = require('webpack');

const webpackServerProductionConfig = require("../webpack.server.production.config.js");

module.exports = {
    rundevserver() {
        nodemon({
            script: 'server/index.js',
            ext: 'js html',
            env: {'NODE_ENV': 'development'},
            nodeArgs: ['--debug']
        }).on('restart', () => {
            gutil.log('server restarted!');
        });
    },

    webpackproduction(cb) {
        webpack(webpackServerProductionConfig).run(function (err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack:build-dev", err);
            }
            cb();
        });
    }
};
