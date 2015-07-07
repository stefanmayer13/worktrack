'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Router = require('react-router');
const Mui = require('material-ui');
const CurrentEntry = require('../components/CurrentEntry');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const RaisedButton = Mui.RaisedButton;
const Link = Router.Link;

module.exports = React.createClass({
    mixins: [MaterialUiMixin],

    render() {
        return (
            <div className='page logger'>
                <div className="backbutton">
                    <Link to="home"><RaisedButton label="Back" /></Link>
                </div>
                <div style={{clear: 'left', paddingTop: '2rem'}}>
                    <p>
                        Worktrack is developed by Stefan Mayer.<br/>
                        <a href="mailto:stefan@stefanmayer.me">stefan@stefanmayer.me</a><br/>
                        <a href="https://twitter.com/stefanmayer13">Twitter</a>
                    </p>
                    <p>
                        Credits:
                        <ul>
                            <li>Password Eye by Hello Many from the Noun Project</li>
                        </ul>
                    </p>
                </div>
            </div>
        );
    }
});
