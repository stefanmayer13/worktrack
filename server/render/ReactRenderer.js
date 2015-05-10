'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let ReactRenderer = {
    render() {
        return '<!DOCTYPE html> \
            <html> \
                <head lang="en"> \
                    <meta charset="UTF-8"> \
                    <title>Test</title> \
                    <link rel="stylesheet" href="styles/main.css" />\
                    <script defer src="/js/rx.lite.min.js"></script>\
                    <script defer src="/js/react.js"></script>\
                    <script defer src="/js/app.js"></script>\
                </head> \
                <body> \
                    <div id="app" />\
                </body> \
            </html>\
        ';
    }
};

module.exports = ReactRenderer;
