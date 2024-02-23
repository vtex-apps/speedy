const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    publicPath: path.resolve(__dirname, 'pixel'),
    path: path.resolve(__dirname, 'pixel'),
    filename: 'speedy_bundle.js',
  },
  plugins: [
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'head-start.html',
      inlineSource: '.(js|css)$',
      template: path.resolve(__dirname, 'template/template.pug'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      { test: /\.pug$/, use: 'pug-loader' },
    ],
  },
  mode: 'production',
}
