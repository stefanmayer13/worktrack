'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let Q = require('q');

let ReactRenderer = {
    render() {
        var deferred = Q.defer();
        deferred.resolve('<!DOCTYPE html> \
            <html> \
                <head lang="en"> \
                    <meta charset="UTF-8"> \
                    <title>Test</title> \
                    <script defer src="/js/rx.lite.min.js"></script>\
                    <script defer src="/js/react.js"></script>\
                    <script defer src="/js/app.js"></script>\
                </head> \
                <body> \
                    <div id="app" />\
                </body> \
            </html>\
        ');
        return deferred.promise;
    }
};

module.exports = ReactRenderer;
