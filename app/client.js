'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
require('es6-promise').polyfill();
require('whatwg-fetch');

const React = require('react/addons');
const Router = require('react-router');
const routes = require('./routes');

Router.run(routes, (Handler) => {
    React.render(<Handler/>, document.body);
});
