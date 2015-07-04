'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const ReactRenderer = require('../render/ReactRenderer');
const Config = require('../Config');

const jsPath = process.env.NODE_ENV === 'production' ? 'js/' : 'tmp/';

module.exports = (server) => {
    server.route({
        method: 'GET',
        path: Config.baseUrl + '/{path*}',
        handler: (request, reply) => {
            reply(ReactRenderer.render(request));
        }
    });

    server.route({
        method: 'GET',
        path: Config.baseUrl + '/js/{filename}',
        handler: {
            file: (request) => {
                return jsPath + request.params.filename;
            }
        }
    });

    server.route({
        method: 'GET',
        path: Config.baseUrl + '/styles/{filename}',
        handler: {
            file: (request) => {
                return 'css/' + request.params.filename;
            }
        }
    });
};
