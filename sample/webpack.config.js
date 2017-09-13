var webpack = require('webpack'),
    path = require('path');

module.exports = [{
    entry: {
        index: ['./index.js'],
    },
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader?presets[]=es2015',
                exclude: /node_modules|bower_components/,
                query: {
                    plugins: ["transform-decorators-legacy", "transform-decorators"]
                }

            }
        ]
    }
}];