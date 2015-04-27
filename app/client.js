'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
require('es6-promise').polyfill();
require('whatwg-fetch');

let React = require('react/addons');

let ReportDetail = require('./pages/ReportDetail');

React.render(<ReportDetail />, document.getElementById('app'));
