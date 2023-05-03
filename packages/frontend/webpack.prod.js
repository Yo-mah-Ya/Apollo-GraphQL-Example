"use strict";

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");
const path = require("path");
const paths = require("./webpack/paths");
const webpackModuleConfig = require("./webpack/module");
const { common, environments } = require("./webpack.common");

process.env.NODE_ENV = "production";

/**
 * @type import('webpack').Configuration
 */
module.exports = merge(common, {
    // Stop compilation early in production
    bail: true,
    devtool: "source-map",
    mode: "production",
    module: webpackModuleConfig({
        ...environments,
        isDevEnvironment: false,
    }),
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // We want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minification steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending further investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    // Added for profiling in devtools
                    keep_classnames: true,
                    keep_fnames: true,
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
            }),
            new CssMinimizerPlugin({
                parallel: true,
            }),
        ],
    },
    output: {
        // The build folder.
        path: paths.appBuild,
        // Add /* filename */ comments to generated require()s in the output.
        pathinfo: false,
        // There will be one main bundle, and one file per asynchronous chunk.
        // In development, it does not produce real files.
        filename: "static/js/[name].[contenthash:8].js",
        // There are also additional JS chunk files if you use code splitting.
        chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
        assetModuleFilename: "static/media/[name].[hash][ext]",
        // webpack uses `publicPath` to determine where the app is being served from.
        // It requires a trailing slash, or the file assets will get an incorrect path.
        // We inferred the "public path" (such as / or /my-project) from homepage.
        publicPath: paths.publicUrlOrPath,
        // Point sourcemap entries to original disk location (format as URL on Windows)
        devtoolModuleFilenameTemplate: (info) =>
            path.relative(paths.appSrc, info.absoluteResourcePath).replace(/\\/g, "/"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "static/css/[name].[contenthash:8].css",
            chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        }),
    ],
});
