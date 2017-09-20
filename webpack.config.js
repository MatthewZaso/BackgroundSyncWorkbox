var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var jsonImporter = require('node-sass-json-importer');

var DIST_DIR = path.resolve(__dirname, 'dist');
var SRC_DIR = path.resolve(__dirname, 'src');

var extractPlugin = new ExtractTextPlugin({
  filename: 'css/[name].css'
});

var config = {
  entry: SRC_DIR + '/app/index.js',
  output: {
    path: DIST_DIR + '/app',
    filename: 'bundle.js',
    publicPath: '/app/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: SRC_DIR,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: extractPlugin.extract([{
          loader: 'css-loader',
          options: {
            importLoaders: 1
          },
        },
        {
          loader: 'sass-loader',
          // Apply the JSON importer via sass-loader's options.
          options: {
            importer: jsonImporter,
          },
        }])
      }
    ],
  },
  plugins: [
    extractPlugin
  ]
};

module.exports = config;