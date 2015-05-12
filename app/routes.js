'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const React = require('react/addons');
const Router = require('react-router');

const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const App = require('./components/App');
const Home = require('./pages/Home');
const Worklog = require('./pages/Worklog');
const Toggl = require('./pages/Toggl');
const NotFound = require('./pages/NotFound');

module.exports = (
    <Route handler={App} path="/">
        <DefaultRoute handler={Home} />
        <Route name="worklog" handler={Worklog} />
        <Route name="toggl" handler={Toggl} />
        <NotFoundRoute handler={NotFound}/>
    </Route>
);
