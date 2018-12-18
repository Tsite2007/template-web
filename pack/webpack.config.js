const path = require('path');
const webpack = require('webpack');
var merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const context = require("../src/libs/interface/context.js");

function resolve (dir) {
    return path.join(__dirname, '..', dir)
}

function getConfig(mode) {
    const devMode=(mode == "development"?true:false);
    var webpackBaseConfig= {
        mode: devMode ? "development" : "production",
        entry: {
            main: ['./src/main.js']
        },
        output: {
            path: path.join(__dirname, '../dist/'),
            publicPath: mode == "development" ? '/' : "",
            filename: `.${context.name}/js/[name]-[hash].js`,
            chunkFilename: `.${context.name}/js/[name]-[hash].js`
        },
        optimization: {
            runtimeChunk: false,
            minimize: mode != "development",
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        name: "vendor",
                        minChunks: 1,
                        maxInitialRequests: 5,
                        minSize: 0,
                        chunks: "all"
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            less:(devMode?['css-hot-loader']:[]).concat([
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: "css-loader",
                                    options: {
                                        url: true,
                                        minimize: true
                                    }
                                },
                                "less-loader"
                            ]),
                            css:(devMode?['css-hot-loader']:[]).concat([
                                MiniCssExtractPlugin.loader,
                                {
                                    loader: "css-loader",
                                    options: {
                                        url: true,
                                        minimize: true
                                    }
                                }
                            ])
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    include: [resolve('src')],
                    loader: 'babel-loader?cacheDirectory=true'
                },
                {
                    test: /\.css$/,
                    use: (devMode?['css-hot-loader']:[]).concat([
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                minimize: true,
                                sourceMap: true
                            }
                        }
                    ])
                },
                {
                    test: /\.less$/,
                    use: (devMode?['css-hot-loader']:[]).concat([
                        MiniCssExtractPlugin.loader,
                        {
                            loader: "css-loader",
                            options: {
                                url: true,
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        "less-loader"
                    ])
                },
                {
                    test: /\.(gif|jpe?g|png|svg|hdr)(\?\S*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            /* * 【改动】：图片小于2kb的按base64打包 */
                            limit: 2048,
                            name: `${devMode?".":""}${context.name}/images/[name].[ext]`
                        }
                    }]
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|otf)(\?\S*)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            /* * 【改动】：图片小于2kb的按base64打包 */
                            limit: 2048,
                            name: `${devMode?".":""}${context.name}/images/[name].[ext]`
                        }
                    }]
                },
                {
                    test: /\.(html|tpl)$/,
                    loader: 'html-loader'
                }
            ]
        },
        resolve: {
            extensions: ['.js','.json', '.vue'],
            modules: [
                resolve('src'),
                resolve('node_modules')
            ],
            alias: {
                '@': resolve('src'),
                '@image': resolve('src/libs/images')
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `.${context.name}/css/[name].css`
            }),
            new HtmlWebpackPlugin({
                template: './src/index.ejs',
                filename: './index.html',
                title: "基础教育大数据应用平台",
                favicon: "./src/libs/images/favicon/favicon.ico",
                inject: false,
                hash: true
            })
        ]
    }

    if(devMode){
        webpackBaseConfig=merge(webpackBaseConfig,{
            module: {
                rules: [
                    {
                        test: /\.(js|vue)$/,
                        loader: "eslint-loader",
                        options: {
                            failOnWarning: true,
                            failOnError: true,
                            configFile: resolve('.eslintrc.json')
                        },
                        enforce: "pre",
                        include: resolve('src'),
                        exclude: /node_modules/
                    }
                ]
            }
        })
    }
    return webpackBaseConfig;
}
module.exports = getConfig;
