var path = require('path'),
    webpack = require("webpack");

module.exports = {
    entry: {
        app: './app/client.js',
        libs: ["react"]
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
        loaders: [
            // FIXME: remove react-router from regex when going back to stable
            {test: /\.js$/, exclude: /\/node_modules\/[^react\-router].*/, loader: 'babel-loader'},
            {test: /\.json$/, loaders: ['json']}
        ]
    },

    plugins: [
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.CommonsChunkPlugin('libs', 'libs.js', Infinity)
        //new webpack.optimize.UglifyJsPlugin()
    ]
};
