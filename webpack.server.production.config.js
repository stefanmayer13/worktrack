var path = require('path'),
    webpack = require("webpack");

module.exports = {
    entry: {
        app: './server/server.js'
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: 'server.js',
        publicPath: '/'
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
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
