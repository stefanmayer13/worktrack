'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Config = require('../../app/Config');

let ReactRenderer = {
    render() {
        return `<!DOCTYPE html>
            <html>
                <head lang="en">
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Worktrack</title>
                    <link rel="stylesheet" href="${Config.baseUrl}/styles/main.css" />
                        <link href="http://fonts.googleapis.com/css?family=Roboto:400,300,500"
                              rel="stylesheet" type="text/css">
                    <script defer src="${Config.baseUrl}/js/lib.js"></script>
                    <script defer src="${Config.baseUrl}/js/app.js"></script>
                </head>
                <body>
                </body>
            </html>
        `;
    }
};

module.exports = ReactRenderer;
