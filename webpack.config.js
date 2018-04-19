var webpack = require('webpack'),
    path = require('path');

var libraryName = 'index',
    plugins = [
        new DtsBundlePlugin()
    ];

var config = {
    entry: {
        index: __dirname + '/src/index.ts'
    },
    devtool: false,
    output: {
        path: path.join(__dirname),
        filename: "[name].js",
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        modules: ['node_modules', path.resolve('./src')],
        extensions: ['.ts']
    },
    plugins: plugins
};

module.exports = config;


function DtsBundlePlugin(){}
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function(){
        var dts = require('dts-bundle');

        dts.bundle({
            name: libraryName,
            main: 'src/index.d.ts',
            out: '../index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true // to use npm in-package typings
        });
    });
};
