const path = require('path');
const { cssEntries, ejsEntries, jsEntries } = require("./config.lib");
const RemoveJsFromEjsPlugin = require('./remove-js-from-ejs-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const { DEV_FOLDER, USE_SOURCE_MAP, CONFIG_JS_ENTRY } = require('./config.settings');

module.exports = {
  mode: 'development',
  entry: () => {
    const entry = {
      ...cssEntries(),
      ...ejsEntries()
    }
    return CONFIG_JS_ENTRY ? { ...entry, ...jsEntries() } : entry
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name(resourcePath) {
                const remove = path.resolve(__dirname, 'src/pages/')
                return resourcePath.replace(remove, 'html').replace(/\.ejs$/, '.html')
              },
            }
          },
          "extract-loader",
          {
            loader: 'html-loader',
            options: {
              attributes: false
            }
          },
          "ejs-plain-loader"
        ]
      }
    ]
  },
  plugins: [
    new ExtraWatchWebpackPlugin({
      dirs: [
        path.resolve(__dirname, 'src/css'),
        path.resolve(__dirname, 'src/pages')
      ],
    }),
    new RemoveJsFromEjsPlugin(),
  ],
  devtool: USE_SOURCE_MAP,
  devServer: {
    static: {
      directory: path.resolve(__dirname, DEV_FOLDER),
      watch: true,
    },
    devMiddleware: {
      writeToDisk: true
    },
    // open: ['html/index.html'],
    open: false,
    allowedHosts: 'all',
    // port,
    host: 'localhost',
    // client: {
    //   webSocketURL: {
    //     port: 8082
    //   }
    // }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 5120000,
    maxAssetSize: 5120000
  }
};