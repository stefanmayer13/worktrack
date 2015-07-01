'use strict';
/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
require("babel/polyfill");
require('es6-promise').polyfill();
require('whatwg-fetch');

const React = require('react/addons');
const Router = require('react-router');
const app = require('./app');
const IsLoggedInAction = require('./actions/IsLoggedInAction');
const injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

let context = app.createContext();

let router = Router.create({
    routes: app.getComponent(),
    location: Router.HashLocation, //TODO fix app to work with Router.HistoryLocation
    transitionContext: context
});

context.getComponentContext().executeAction(IsLoggedInAction);

router.run((Handler) => {
    let Component = React.createFactory(Handler);
    React.render(Component({
        context: context.getComponentContext()
    }), document.body);
});
