const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            bare_returns: true,
            html5_comments: false,
          },
          compress: {
            unsafe: true,
            arrows: false,
            evaluate: false,
            expression: true,
            properties: false,
          },
          mangle: true,
          format: {
            braces: true,
            max_line_len: 100,
            quote_keys: true,
            quote_style: 0,
            semicolons: false,
            keep_quoted_props: true,
          },
        },
      }),
    ],
  },
  output: {
    publicPath: path.resolve(__dirname, 'pixel'),
    path: path.resolve(__dirname, 'pixel'),
    filename: 'speedy_bundle.js',
  },
  plugins: [
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
