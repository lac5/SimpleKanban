const { join } = require('path');
const { EnvironmentPlugin } = require('webpack');
const SveltePreprocess = require('svelte-preprocess');
const Autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const DEBUG = process.env.NODE_ENV !== 'production';

const environmentPlugin = new EnvironmentPlugin(Object.keys(process.env));

const rules = [
    {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        },
    },
];

module.exports = [{
    mode: process.env.NODE_ENV,
    devtool: DEBUG && 'source-map',
    target: 'web',
    entry: './src/main',
    output: {
        path: join(__dirname, 'build'),
        filename: 'main.js',
        chunkFilename: 'main.[id].js'
    },
    module: {
        rules: [
            ...rules,
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        compilerOptions: {
                            dev: DEBUG
                        },
                        emitCss: !DEBUG,
                        hotReload: DEBUG,
                        hotOptions: {
                            noPreserveState: false,
                            optimistic: true,
                        },
                        preprocess: SveltePreprocess({
                            scss: true,
                            sass: true,
                            postcss: {
                                plugins: [
                                    Autoprefixer
                                ]
                            }
                        })
                    }
                }
            },
            {
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.(scss|sass)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    Autoprefixer
                                ]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
        ]
    },
    plugins: [
        environmentPlugin,
        new HtmlWebpackPlugin({
            template: join(__dirname, 'src/index.html'),
        }),
        new MiniCssExtractPlugin(),
    ],
    resolve: {
        alias: {
            svelte: join(__dirname, 'node_modules/svelte'),
        },
        extensions: ['.mjs', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main']
    },
}, {
    mode: process.env.NODE_ENV,
    devtool: DEBUG && 'source-map',
    target: 'electron-main',
    entry: './src/electron',
    output: {
        path: join(__dirname, 'build'),
        filename: 'electron.js',
        chunkFilename: 'electron.[id].js'
    },
    module: { rules },
    plugins: [environmentPlugin],
}, {
    mode: process.env.NODE_ENV,
    devtool: DEBUG && 'source-map',
    target: 'electron-preload',
    entry: './src/preload',
    output: {
        path: join(__dirname, 'build'),
        filename: 'preload.js',
        chunkFilename: 'preload.[id].js'
    },
    module: { rules },
    plugins: [environmentPlugin],
}];
