'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Config = require('../../app/Config');

let ReactRenderer = {
    render() {
        const neededPolyfills = [
            'Array.prototype.includes'
        ];
        const polyfillUrl = `https://cdn.polyfill.io/v1/polyfill.min.js?` +
            `features=${neededPolyfills.join(',')}&callback=init`;

        return `<!DOCTYPE html>
            <html>
                <head lang="en">
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <title>Worktrack</title>
                    <link rel="stylesheet" href="${Config.baseUrl}/styles/main.css">
                    <link href="http://fonts.googleapis.com/css?family=Roboto:400,300,500"
                          rel="stylesheet" type="text/css">
                    <script>
                        function init() {
                            if (typeof(worktrack) === 'function') {
                                worktrack();
                            } else {
                                window.worktrack_init = true;
                            }
                        }
                    </script>
                    <script defer async src="${Config.baseUrl}/js/app.js"></script>
                    <script defer async src="${polyfillUrl}"></script>
                </head>
                <body>
                </body>
            </html>
        `;
    }
};

module.exports = ReactRenderer;
