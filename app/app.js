'use strict';

const Fluxible = require('fluxible');

let app = new Fluxible({
    component: require('./routes')
});

app.registerStore(require('./stores/UserStore'));
app.registerStore(require('./stores/WorklogStore'));

module.exports = app;
