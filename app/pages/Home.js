'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');

const Link = Router.Link;

const Home = React.createClass({
    render() {
        return (
            <div className='page'>
                <h1>Welcome to Worktrack</h1>
                <p>
                    The following pages are currently available:
                    <ul>
                        <li><Link to="worklog">Worklog</Link></li>
                        <li><Link to="toggl">Toggl</Link></li>
                    </ul>
                </p>
            </div>
        );
    }
});

module.exports = Home;
