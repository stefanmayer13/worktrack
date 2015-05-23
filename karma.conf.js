'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
var webpack = require('webpack');

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            'tests.webpack.js'
        ],
        frameworks: ['jasmine'],
        preprocessors: {
            'tests.webpack.js': ['webpack'],
            'app/**/*.js': ['coverage'],
            'server/**/*.js': ['coverage']
        },
        reporters: ['spec', 'coverage'],
        coverageReporter: {
            type: 'html',
            dir: 'build/coverage/',
            includeAllSources: true
        },
        singleRun: true,
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.js?$/,
                        exclude: /(tmp|node_modules)/,
                        loader: 'babel-loader'
                    }
                ],
                postLoaders: [{
                    test: /\.js?$/,
                    exclude: /(tests|tmp|node_modules)/,
                    loader: 'istanbul-instrumenter'
                }]
            }
        },
        webpackServer: {
            noInfo: true
        }
    });
};
