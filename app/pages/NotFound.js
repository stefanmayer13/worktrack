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
                <h1>Sorry this page couldn't be found</h1>
                <p>
                    Back to the startpage: <Link to="home">Home</Link>.
                </p>
            </div>
        );
    }
});

module.exports = Home;
