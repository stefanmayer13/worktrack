'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

let ReactRenderer = require('../render/ReactRenderer');

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: (request, reply) => {
            ReactRenderer.render(request).then((html) => {
                reply(html);
            }).catch((error) => {
                switch (error.name) {
                    case 'RedirectError':
                        reply().redirect(error.url);
                        break;
                    default:
                        console.log('Rendering Error: ', error.stack);
                        reply(new Error('ERROR'));
                        break;
                }
            });
        }
    });

    server.route({
        method: 'GET',
        path: '/js/{filename}',
        handler: {
            file: (request) => {
                return 'tmp/' + request.params.filename;
            }
        }
    });
};
