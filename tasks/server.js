'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let gulp = require('gulp');
let gutil = require("gulp-util");
let nodemon = require('nodemon');

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
    }
};
