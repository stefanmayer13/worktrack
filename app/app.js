'use strict';

const Fluxible = require('fluxible');

let app = new Fluxible({
    component: require('./routes')
});

app.registerStore(require('./stores/UserStore'));

module.exports = app;
