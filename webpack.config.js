const NODE_ENV = process.env.NODE_ENV || "dev";
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

console.log(NODE_ENV);

module.exports = {
    entry: {
        app: './src/index.js'
    },
    devtool: NODE_ENV == 'production' ? '' : 'source-map',
    output: {
        path: __dirname,
        publicPath: '/',
        hash: true,
        filename: "assets/build/[name].[chunkhash:8].js",
        chunkFilename: "assets/build/[name].[chunkhash:8].js",
    },
    module: {
        loaders: [{
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                plugins: ['transform-decorators-legacy' ],
                presets: ['react', 'es2015', 'stage-1']
            }
        },
            { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
            {
                test: /\.html$/,
                loader: "html"
            },
            { test: /\.json$/, loader: 'json' },
            { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff&name=assets/fonts/[name].[ext]" },
            { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff2&name=assets/fonts/[name].[ext]" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream&name=assets/fonts/[name].[ext]" },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/file&name=assets/fonts/[name].[ext]" },
            { test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/file&name=assets/fonts/[name].[ext]" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/svg+xml&name=assets/fonts/[name].[ext]" },
            { test: /\.(jpeg|png|gif|jpg)$/,         loader: 'url-loader?limit=100000&minetype=application/file&name=assets/img/[name].[ext]' },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader?importLoaders=1")
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(
                    'css?sourceMap!' +
                    'less?sourceMap'
                )
            },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(['css-loader!sass-loader?importLoaders=1'])
            }
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    devServer: {
        historyApiFallback: true,
        contentBase: './'
    },
    plugins: NODE_ENV.toString() == 'production' ? [
        new CleanWebpackPlugin(['assets/build'], {
            root: __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new ExtractTextPlugin("./assets/build/stylesheet.[contenthash:8].css"),
        new OptimizeCSSAssetsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('./assets/build/build.js', Infinity),
        new webpack.optimize.AggressiveMergingPlugin(),
        // new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
            mangle: true,
            sourceMap: true,
            minimize: false,
            compress: {
                warnings     : false,
                pure_getters : false,
                unsafe_comps : false,
                screw_ie8    : false,
                dead_code    : true,
                sequences    : true,
                booleans     : true,
                loops        : true,
                unused       : true,
                drop_console : true,
                unsafe       : true
            },
            output: {
                comments: false,
                screw_ie8: true
            }
        }),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: true,
            cashe: true,
             hash: true,
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
                minifyURLs: true
            }
        })
    ] : [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin('./assets/build/build.js'),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new ExtractTextPlugin("./assets/build/stylesheet.[contenthash:8].css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            cashe: true
        })
    ]
};