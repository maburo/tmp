const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  },
  devtool: 'inline-source-map',
  watch: true,
  devServer: {
    contentBase: path.join(__dirname, './dist/'),
    watchOptions: {
      ignored: /node_modules/
    }
  }
}