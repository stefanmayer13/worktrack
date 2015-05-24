'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
var webpack = require('webpack');
var RewirePlugin = require("rewire-webpack");

module.exports = function(config) {
    config.set({
        browsers: ['PhantomJS'],
        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './tests/tests.webpack.js'
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
            },
            plugins: [
                new RewirePlugin()
            ]
        },
        webpackServer: {
            noInfo: true
        }
    });
};
