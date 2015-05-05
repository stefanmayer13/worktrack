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
            reply(ReactRenderer.render(request));
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
