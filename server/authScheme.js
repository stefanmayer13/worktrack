var Boom = require('boom');


module.exports = function() {
    return {
        authenticate: function(request, reply) {
            var sessionUser = request.session.get('user');

            if (sessionUser) {
                return reply.continue({
                    credentials: sessionUser
                });
            }
            return reply(Boom.forbidden('You have to be logged in!', 'default'));
        }
    };
};
