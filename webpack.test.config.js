/**
 * Created by sean@ihuanqu.com on 2018/8/30.
 */

const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');

const CDN_PATH = '//static.iyouchain.com/remix-ide/test/';

module.exports = {
  entry:{
    main:["babel-polyfill",path.resolve(SRC_PATH,"index")]
  },
  output:{
    path: DIST_PATH,
    publicPath: CDN_PATH,
    filename: 'scripts/[name].[hash].js',
    chunkFilename: 'scripts/[name].[chunkhash].js'
  },
  devServer: {
    contentBase: "dist",
    //热更新
    hot:true,
    overlay: true
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("test")
      }
    }),
    new CleanWebpackPlugin('dist', {
      root: __dirname,
      verbose: true,
      dry: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "styles/main.[contenthash].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebPackPlugin({
      template:"./src/index.html",
      filename:"index.html",
      chunks: ['main'],
      inject: 'body',
      minify: {
        removeComments: true,//移除html中的注释
        collapseWhitespace: true//删除空白符和换行符
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use:[MiniCssExtractPlugin.loader,"css-loader"]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test:/\.(jpg|png|svg|gif)$/,
        //多个loader需要从后到前进行解析(大于1000kb打包)
        use:["url-loader?limit=1000&name=images/[name]-[hash:8].[ext]"]
      }
    ]
  }
};