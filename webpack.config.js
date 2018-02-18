const path = require("path");
const fs = require('fs');
const webpack = require("webpack");

const sourceFolder = path.resolve(__dirname, "./src");
const outputFolder = path.resolve(__dirname, "./dist");
const config = path.resolve(__dirname, "./config.json");
const modulesFolder = path.resolve(__dirname, "./node_modules");


var nodeModules = {}
fs.readdirSync(modulesFolder)
    .filter(function(x) {
        return ['.bin'].indexOf(x) === -1
    })
    .forEach(function(mod) {
        nodeModules[mod] = 'commonjs ' + mod
    })


module.exports = {
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ["babel"]
        }, {
            test: /\.json$/,
            loader: 'json-loader'
        }]
    },
    externals: nodeModules,
    devtool: "eval",
    target: 'node',
    resolve: {
        root: [
            sourceFolder,
            modulesFolder,
        ],
        alias: {
            globalConfig$: config,
        },
    },
    entry: [
        sourceFolder
    ],
    output: {
        path: outputFolder,
        filename: "bundle.js"
    },
    plugins: [],
};
