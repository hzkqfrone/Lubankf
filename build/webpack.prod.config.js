const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: 'https://cdn.lubankf.com/admin/dist/',  //服务器域名 
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    externals: {
        'vue': 'Vue',
        // 'iview': 'iview',
        'axios':'axios',
    },
    plugins: [
        new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            // name: 'vendors',
            // filename: 'vendors.[hash].js',
            name: ['vender-exten', 'vender-base'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // }),
        new UglifyJsPlugin({
            uglifyOptions: {
              compress: {
                warnings: false
              }
            },
            sourceMap: true
          }),
        // new UglifyJsParallelPlugin({
        //     workers: os.cpus().length,
        //     mangle: true,
        //     compressor: {
        //       warnings: false,
        //       drop_console: true,
        //       drop_debugger: true
        //      }
        // }),
        new CopyWebpackPlugin([
            {
                from: 'td_icon.ico'
            },
            {
                from: 'src/styles/fonts',
                to: 'fonts'
            },
            {
                from: 'src/views/main-components/theme-switch/theme'
            },
            {
                from: 'src/views/my-components/text-editor/tinymce'
            }
        ], {
            ignore: [
                'text-editor.vue'
            ]
        }),
        new HtmlWebpackPlugin({
            title: 'iView admin v' + package.version,
            favicon: './src/images/logo.ico',
            filename: '../index.html',
            template: '!!ejs-loader!./src/template/index.ejs',
            inject: false
        }),
        // 压缩js代码
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            // 排除关键字，不能混淆
            except:['$','exports','require']
        }),
    ]
});