const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const GenerateIndexHtmlPlugin = require('./generate-index-html-plugin');
const CssOutputPlugin = require('./css-output-plugin');
const { sprites, configJsEntry } = require("./config.lib");
const { spriteDirName } = require('./sprite-options')
const fs = require('fs');
const devServerConfig = fs.existsSync('./dev-server-config.js') ? require('./dev-server-config') : false
const devFolder = devServerConfig && devServerConfig['DEV_FOLDER'] ? devServerConfig['DEV_FOLDER'] : 'dev';
const prodFolder = devServerConfig && devServerConfig['PROD_FOLDER'] ? devServerConfig['PROD_FOLDER'] : 'build';

module.exports = (mode) => {
  const outputPath = mode === 'production' ? prodFolder : devFolder
  const cssOutputStyles = { // compressed < expanded
    development: 'expanded',
    production: 'compressed'
  }

  const jsPattern = () => {
    return configJsEntry ? [] : [{
      context: 'src',
      from: 'js/**',
      to: path.resolve(__dirname, outputPath),
      noErrorOnMissing: true
    }]
  }

  return {
    output: {
      path: path.resolve(__dirname, outputPath),
      filename: 'js/[name].js',
      publicPath: "/",
      environment: {
        arrowFunction: false,
        const: false,
        destructuring: false,
        forOf: false,
        module: false,
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                sourceType: 'unambiguous',
                presets: [
                  '@babel/preset-env',
                ],
                plugins: [['@babel/plugin-transform-runtime', { corejs: 3, target: { ie: 11 } }]]
              }
            },
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            }
          }
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "css/[name].css",
              },
            },
            "extract-loader",
            {
              loader: "css-loader",
              options: {
                url: false
              }
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sassOptions: {
                  outputStyle: cssOutputStyles[mode]
                },
              },
            },
          ],
        },
      ]
    },
    plugins: [
      ...sprites(outputPath),
      new GenerateIndexHtmlPlugin(),
      new CssOutputPlugin({
        mode,
      }),
      new CopyPlugin({
        patterns: [
          {
            context: 'src',
            from: 'css/**/*.css',
            to: path.resolve(__dirname, outputPath),
            noErrorOnMissing: true
          },
          {
            context: 'src',
            from: 'images/**/*',
            globOptions: {
              ignore: ['**/'+ spriteDirName + '*/**'],
            },
            to: path.resolve(__dirname, outputPath),
            noErrorOnMissing: true
          },
          {
            context: 'src',
            from: 'fonts/**',
            to: path.resolve(__dirname, outputPath),
            noErrorOnMissing: true
          },
          ...jsPattern()
        ],
      }),
      new RemoveEmptyScriptsPlugin({ ignore: 'webpack-dev-server' }),
    ]
  };
}
