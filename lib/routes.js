'use strict';

var index = require('./controllers'),
    users = require('./controllers/users'),
    tasks = require('./controllers/tasks'),
    jiratasks = require('./controllers/jiratasks'),
    session = require('./controllers/session'),
    passport = require('passport');

var middleware = require('./middleware');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.post('/api/users', users.create);
  app.put('/api/users', users.changeUser);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id',users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);

  app.post('/api/tasks', tasks.create);
  app.get('/api/tasks', tasks.showAll);
  app.get('/api/tasks/sync', tasks.showNotSynced);

  app.get('/api/jiratasks', jiratasks.showAll);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};