"use strict";

const fs = require("fs");
const { createHash } = require("crypto");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const paths = require("./webpack/paths");

const assertGetEnvValueFrom = (key) => {
    if (typeof key !== "string")
        throw new Error(
            `Cannot get Environment Value. key: ${JSON.stringify(key)} is not string`
        );
    const value = process.env[key];
    if (value == undefined)
        throw new Error(`Cannot get Environment Value. value is undefined, key: ${key}`);
    return value;
};

const environments = ["CDN_ENDPOINT", "LOG_LEVEL"].reduce((processEnv, envKey) => {
    processEnv[`process.env.${envKey}`] = JSON.stringify(assertGetEnvValueFrom(envKey));
    return processEnv;
}, {});

const createEnvironmentHash = (env) => {
    const hash = createHash("md5");
    hash.update(JSON.stringify(env));
    return hash.digest("hex");
};

/**
 * @type import('webpack').Configuration
 */
const common = {
    cache: {
        type: "filesystem",
        version: createEnvironmentHash(environments),
        cacheDirectory: paths.appWebpackCache,
        store: "pack",
        buildDependencies: {
            defaultWebpack: ["webpack/lib/"],
            config: [__filename],
            tsconfig: [paths.appTsConfig, paths.appJsConfig].filter((f) =>
                fs.existsSync(f)
            ),
        },
    },
    entry: paths.appIndexJs,
    infrastructureLogging: {
        level: "none",
    },
    plugins: [
        new webpack.DefinePlugin(environments),
        // Generate an asset manifest file with the following content:
        // - "files" key: Mapping of all asset filenames to their corresponding
        //   output file so that tools can pick it up without having to parse
        //   `index.html`
        // - "entrypoints" key: Array of files which are included in `index.html`,
        //   can be used to reconstruct the HTML if necessary
        new WebpackManifestPlugin({
            fileName: "asset-manifest.json",
            publicPath: paths.publicUrlOrPath,
            generate: (seed, files, entrypoints) => {
                const manifestFiles = files.reduce((manifest, file) => {
                    manifest[file.name] = file.path;
                    return manifest;
                }, seed);
                const entrypointFiles = entrypoints.main.filter(
                    (fileName) => !fileName.endsWith(".map")
                );

                return {
                    files: manifestFiles,
                    entrypoints: entrypointFiles,
                };
            },
        }),
    ],
    resolve: {
        modules: ["node_modules"],
        extensions: [".tsx", ".ts", ".jsx", ".js", ".json", "..."],
    },
    // Webpack noise constrained to errors and warnings
    stats: "errors-warnings",
    target: ["browserslist"],
};

module.exports = {
    common,
    environments,
};
