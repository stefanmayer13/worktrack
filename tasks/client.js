'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let webpack = require('webpack');
let gutil = require('gulp-util');

let webpackConfig = require("../webpack.config.js");
let webpackDevConfig = Object.create(webpackConfig);
webpackDevConfig.devtool = "sourcemap";
webpackDevConfig.debug = true;
let devCompiler = webpack(webpackDevConfig);

module.exports = {
    webpack(cb) {
        devCompiler.run(function(err, stats) {
            if (err) {
                throw new gutil.PluginError("webpack:build-dev", err);
            }
            gutil.log("[webpack:build-dev]", stats.toString({
                colors: true
            }));
            cb();
        });
    }
}
