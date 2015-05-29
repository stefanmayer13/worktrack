'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
require('es6-promise').polyfill();
require('whatwg-fetch');

const React = require('react/addons');
const Router = require('react-router');
const routes = require('./routes');
const injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

Router.run(routes, Router.HistoryLocation, (Handler) => {
    React.render(<Handler/>, document.body);
});
