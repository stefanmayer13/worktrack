'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');

const RouteHandler = Router.RouteHandler;

const App = React.createClass({
    render() {
        return (
            <div>
                <RouteHandler />
                <footer>@Stefan Mayer &lt;stefanmayer13@gmail.com&gt;</footer>
            </div>
        );
    }
});

module.exports = App;
