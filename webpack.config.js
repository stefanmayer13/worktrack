var path = require('path'),
    webpack = require("webpack");

module.exports = {
    entry: {
        app: './app/client.js'
    },
    output: {
        path: path.join(__dirname, "tmp"),
        filename: 'app.js',
        publicPath: 'tmp/scripts/'
    },

    resolve: {
        extensions: ['', '.js']
    },

    module: {
        loaders: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, "app"),
                path.resolve(__dirname, "server")
            ],
            loader: 'babel-loader?stage=1'
        },
        {
            test: /\.json$/,
            loaders: ['json']
        }]
    },

    plugins: [

    ]
};
