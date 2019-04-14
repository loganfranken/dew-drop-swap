const path = require('path');

module.exports = {
  entry: './script/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'script')
  },
  devtool: 'source-map'
};