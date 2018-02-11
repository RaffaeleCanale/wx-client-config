const path = require("path");
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const sourceFolder = path.resolve(__dirname, "./src");
const outputFolder = path.resolve(__dirname, "./dist");
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
        }]
    },
    externals: nodeModules,
    devtool: "eval",
    target: 'node',
    resolve: {
        root: [
            path.resolve(sourceFolder),
            path.resolve(modulesFolder)
        ]
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
