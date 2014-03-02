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
  app.put('/api/users', users.changeUser);
  app.get('/api/users/me', users.me);
  app.get('/api/users/:id',users.show);

  app.post('/api/session', session.login);
  app.del('/api/session', session.logout);
  app.get('/api/jirasession', session.isJiraConnected);

  app.post('/api/tasks', tasks.create);
  app.put('/api/tasks/:id', tasks.add);
  app.post('/api/tasks/:id', tasks.sync);
  app.get('/api/tasks', tasks.showAll);
  app.get('/api/tasks/sync', tasks.showNotSynced);

  app.get('/api/jiratasks', jiratasks.showAll);

  // All other routes to use Angular routing in app/scripts/app.js
  app.get('/partials/*', index.partials);
  app.get('/*', middleware.setUserCookie, index.index);
};