"use strict";

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const { merge } = require("webpack-merge");
const path = require("path");
const paths = require("./webpack/paths");
const webpackModuleConfig = require("./webpack/module");
const { common, environments } = require("./webpack.common");

process.env.NODE_ENV = "development";

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(common, {
    // Stop compilation early in production
    bail: false,
    devServer: {
        compress: true,
        devMiddleware: {
            // It is important to tell WebpackDevServer to use the same "publicPath" path as
            // we specified in the webpack config. When homepage is '.', default to serving
            // from the root.
            // remove last slash so user can land on `/test` instead of `/test/`
            publicPath: paths.publicUrlOrPath.slice(0, -1),
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        },
        historyApiFallback: {
            // Paths with dots should still use the history fallback.
            // See https://github.com/facebook/create-react-app/issues/387.
            disableDotRule: true,
            index: paths.publicUrlOrPath,
        },
        hot: true,
        port: 8000,
        static: {
            directory: paths.appPublic,
            publicPath: [paths.publicUrlOrPath],
            // By default files from `contentBase` will not trigger a page reload.
            watch: {
                // Reportedly, this avoids CPU overload on some systems.
                // https://github.com/facebook/create-react-app/issues/293
                // src/node_modules is not ignored to support absolute imports
                // https://github.com/facebook/create-react-app/issues/1065
                ignored: ignoredFiles(paths.appSrc),
            },
        },
    },
    devtool: "cheap-module-source-map",
    mode: "development",
    module: webpackModuleConfig({
        ...environments,
        isDevEnvironment: true,
    }),
    optimization: {
        minimize: false,
    },
    output: {
        // The build folder.
        path: paths.appBuild,
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: true,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: "static/js/bundle.js",
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: "static/js/[name].chunk.js",
        assetModuleFilename: "static/media/[name].[hash][ext]",
        // webpack uses `publicPath` to determine where the app is being served from.
        // It requires a trailing slash, or the file assets will get an incorrect path.
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: paths.publicUrlOrPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) =>
            path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
    ],
});
