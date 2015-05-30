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
                    <meta name="viewport" content="width=device-width, initial-scale=1"> \
                    <title>Test</title> \
                    <link rel="stylesheet" href="/styles/main.css" />\
                    <script defer src="/js/rx.lite.min.js"></script>\
                    <script defer src="/js/app.js"></script>\
                    <link href="http://fonts.googleapis.com/css?family=Roboto:400,300,500"\
                        rel="stylesheet" type="text/css">\
                </head> \
                <body> \
                </body> \
            </html>\
        ';
    }
};

module.exports = ReactRenderer;
