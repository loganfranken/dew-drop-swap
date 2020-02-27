const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './script/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'script')
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
        WEBGL_RENDERER: true,
        CANVAS_RENDERER: true
    })
  ]
};