'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const Mui = require('material-ui');
const MaterialUiMixin = require('../mixins/MaterialUiMixin');

const CircularProgress = Mui.CircularProgress;

module.exports = React.createClass({
    mixins: [MaterialUiMixin],

    propTypes: {
        start: React.PropTypes.object
    },

    getInitialState() {
        return {
            elapsed: 0
        };
    },

    componentDidMount() {
        this.timer = setInterval(this._tick, 50);
    },

    componentWillUnmount() {
        clearInterval(this.timer);
    },

    render() {
        let elapsed = Math.round(this.state.elapsed / 100) * 4;
        let seconds = (elapsed / 10).toFixed(1);
        let minutes = Math.floor(seconds / 60);

        return (
            <div>
                <CircularProgress mode="determinate" value={seconds} size={1} max={60} style={{
                    left: '50px'
                }} />
                <CircularProgress mode="determinate" value={minutes} size={2} max={60} style={{
                    left: '-55px'
                }}/>
            </div>
        );
    },

    _tick() {
        this.setState({elapsed: new Date() - this.props.start});
    }
});
