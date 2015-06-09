'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const React = require('react/addons');
const Router = require('react-router');

const Route = Router.Route;
const DefaultRoute = Router.DefaultRoute;
const NotFoundRoute = Router.NotFoundRoute;

const AuthenticatedPage = require('./pages/AuthenticatedPage');
const App = require('./components/App');
const Home = require('./pages/Home');
const Logger = require('./pages/Logger');
const Worklog = require('./pages/Worklog');
const WorklogChart = require('./pages/WorklogChart');
const Toggl = require('./pages/Toggl');
const Login = require('./pages/Login');
const NotFound = require('./pages/NotFound');

module.exports = (
    <Route handler={App} path="/">
        <Route name="auth" path="/" handler={AuthenticatedPage}>
            <DefaultRoute name="home" handler={Home} />
            <Route name="log" path="log" handler={Logger} />
            <Route name="worklog" path="worklog/?:date?" handler={Worklog} />
            <Route name="worklogchart" path="worklog/chart/?:date?" handler={WorklogChart} />
            <Route name="toggl" handler={Toggl} />
            <Route name="login" handler={Login} />
            <NotFoundRoute handler={NotFound}/>
        </Route>
    </Route>
);
