'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const React = require('react/addons');
const ThemeManager = require('material-ui/lib/styles/theme-manager')();
const Colors = require('material-ui/lib/styles/colors');

let MaterialUiMixin = {
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    componentWillMount: function() {
        ThemeManager.setPalette({
            accent1Color: Colors.deepOrange500
        });
    }
};

module.exports = MaterialUiMixin;
