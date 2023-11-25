const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const BeautifyHtmlWebpackPlugin = require('beautify-html-webpack-plugin');
const { HtmlWebpackPlugins, cssEntries, jsEntries } = require("./config.lib");
const { CONFIG_JS_ENTRY, IS_JS_MINIFY } = require('./config.settings');

module.exports = {
  mode: 'production',
  entry: () => {
    const entry = {
      ...cssEntries(),
    }
    return CONFIG_JS_ENTRY ? { ...entry, ...jsEntries() } : { ...entry }
  },
  optimization: {
    minimize: IS_JS_MINIFY
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              attributes: false,
              minimize: {
                removeComments: false,
                conservativeCollapse: false,
              },
            }
          },
          "ejs-plain-loader"
        ]
      }
    ]
  },
  plugins: [
    ...HtmlWebpackPlugins(),
    new RemoveEmptyScriptsPlugin({ ignore: 'webpack-dev-server' }),
    new BeautifyHtmlWebpackPlugin()
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000
  }
}