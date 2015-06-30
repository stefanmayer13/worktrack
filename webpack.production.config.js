var path = require('path'),
    webpack = require("webpack");

module.exports = {
    entry: {
        app: './app/client.js',
        lib: ["react", "material-ui"]
    },
    output: {
        path: path.join(__dirname, "build", "js"),
        filename: 'app.js',
        publicPath: 'js/'
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
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"lib", /* filename= */"lib.js"),
        new webpack.optimize.UglifyJsPlugin()
    ]
};
