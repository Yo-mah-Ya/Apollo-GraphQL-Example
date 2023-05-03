const paths = require("./paths");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");

/**
 *
 * @param {boolean} isDevEnvironment
 */
const styleLoader = (isDevEnvironment) => isDevEnvironment && "style-loader";
/**
 *
 * @param {{ [index: string]: any }} options
 */
const cssLoader = (options) => ({
    loader: "css-loader",
    options,
});
/**
 *
 * @param {boolean} isDevEnvironment
 */
const miniCssLoader = (isDevEnvironment) =>
    !isDevEnvironment && {
        loader: MiniCssExtractPlugin.loader,
        // css is located in `static/css`, use '../../' to locate index.html folder
        // in production `paths.publicUrlOrPath` can be a relative path
        options: paths.publicUrlOrPath.startsWith(".") ? { publicPath: "../../" } : {},
    };
/**
 *
 * @param {boolean} isDevEnvironment
 */
const postCssLoader = (isDevEnvironment) => ({
    loader: "postcss-loader",
    options: {
        postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: "postcss",
            config: false,
            plugins: [
                "postcss-flexbugs-fixes",
                [
                    "postcss-preset-env",
                    {
                        autoprefixer: {
                            flexbox: "no-2009",
                        },
                        stage: 3,
                    },
                ],
                // Adds PostCSS Normalize as the reset css with default options,
                // so that it honors browserslist config in package.json
                // which in turn let's users customize the target behavior as per their needs.
                "postcss-normalize",
            ],
        },
        sourceMap: isDevEnvironment,
    },
});
/**
 *
 * @param {boolean} isDevEnvironment
 */
const resolveUrlLoader = (isDevEnvironment) => ({
    loader: "resolve-url-loader",
    options: {
        sourceMap: isDevEnvironment,
        root: paths.appSrc,
    },
});

const sassLoader = () => ({
    loader: "sass-loader",
    options: {
        sourceMap: true,
    },
});
/**
 *
 * @param { { isDevEnvironment: boolean } } envConfig
 * @returns @type import('webpack').ModuleOptions
 */
module.exports = ({ isDevEnvironment }) =>
    /**
     * @type import('webpack').ModuleOptions
     */
    ({
        strictExportPresence: true,
        rules: [
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
                test: [/\.avif$/],
                type: "asset",
                mimetype: "image/avif",
                parser: {
                    dataUrlCondition: {
                        maxSize: parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT ?? "10000"),
                    },
                },
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                type: "asset",
                parser: {
                    dataUrlCondition: {
                        maxSize: parseInt(process.env.IMAGE_INLINE_SIZE_LIMIT ?? "10000"),
                    },
                },
            },
            // {
            //     test: /\.svg$/,
            //     use: [
            //         {
            //             loader: require.resolve("@svgr/webpack"),
            //             options: {
            //                 prettier: false,
            //                 svgo: false,
            //                 svgoConfig: {
            //                     plugins: [{ removeViewBox: false }],
            //                 },
            //                 titleProp: true,
            //                 ref: true,
            //             },
            //         },
            //         {
            //             loader: require.resolve("file-loader"),
            //             options: {
            //                 name: "static/media/[name].[hash].[ext]",
            //             },
            //         },
            //     ],
            //     issuer: {
            //         and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
            //     },
            // },
            // "postcss" loader applies autoprefixer to our CSS.
            // "css" loader resolves paths in CSS and adds assets as dependencies.
            // "style" loader turns CSS into JS modules that inject <style> tags.
            // In production, we use MiniCSSExtractPlugin to extract that CSS
            // to a file, but in development "style" loader enables hot editing
            // of CSS.
            // By default we support CSS Modules with the extension .module.css
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [
                    styleLoader(isDevEnvironment),
                    miniCssLoader(isDevEnvironment),
                    cssLoader({
                        importLoaders: 1,
                        sourceMap: isDevEnvironment,
                        modules: {
                            mode: "icss",
                        },
                    }),
                    postCssLoader(isDevEnvironment),
                ].filter(Boolean),
                // Don't consider CSS imports dead code even if the
                // containing package claims to have no side effects.
                // Remove this when webpack adds a warning or an error for this.
                // See https://github.com/webpack/webpack/issues/6571
                sideEffects: true,
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
                test: /\.module\.css$/,
                use: [
                    styleLoader(isDevEnvironment),
                    miniCssLoader(isDevEnvironment),
                    cssLoader({
                        importLoaders: 1,
                        sourceMap: isDevEnvironment,
                        modules: {
                            mode: "local",
                            getLocalIdent: getCSSModuleLocalIdent,
                        },
                    }),
                    postCssLoader(isDevEnvironment),
                ].filter(Boolean),
            },
            // Opt-in support for SASS (using .scss or .sass extensions).
            // By default we support SASS Modules with the
            // extensions .module.scss or .module.sass
            {
                test: /\.(scss|sass)$/,
                exclude: /\.module\.(scss|sass)$/,
                use: [
                    styleLoader(isDevEnvironment),
                    miniCssLoader(isDevEnvironment),
                    cssLoader({
                        importLoaders: 3,
                        sourceMap: isDevEnvironment,
                        modules: {
                            mode: "icss",
                        },
                    }),
                    postCssLoader(isDevEnvironment),
                    resolveUrlLoader(isDevEnvironment),
                    sassLoader(),
                ].filter(Boolean),
                // Don't consider CSS imports dead code even if the
                // containing package claims to have no side effects.
                // Remove this when webpack adds a warning or an error for this.
                // See https://github.com/webpack/webpack/issues/6571
                sideEffects: true,
            },
            // Adds support for CSS Modules, but using SASS
            // using the extension .module.scss or .module.sass
            {
                test: /\.module\.(scss|sass)$/,
                use: [
                    styleLoader(isDevEnvironment),
                    miniCssLoader(isDevEnvironment),
                    cssLoader({
                        importLoaders: 3,
                        sourceMap: isDevEnvironment,
                        modules: {
                            mode: "local",
                            getLocalIdent: getCSSModuleLocalIdent,
                        },
                    }),
                    postCssLoader(isDevEnvironment),
                    resolveUrlLoader(isDevEnvironment),
                    sassLoader(),
                ].filter(Boolean),
            },
            // {
            //     test: /\.jsx?$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: "babel-loader",
            //             options: {
            //                 presets: [
            //                     // https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
            //                     "@babel/preset-env",
            //                     [
            //                         "@babel/preset-react",
            //                         { runtime: "automatic" },
            //                     ],
            //                 ],
            //             },
            //         },
            //     ],
            // },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ["ts-loader"],
            },
        ],
    });
