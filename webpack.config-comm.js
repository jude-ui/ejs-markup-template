const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const GenerateIndexHtmlPlugin = require('./generate-index-html-plugin');
const CssOutputPlugin = require('./css-output-plugin');
const { sprites } = require("./config.lib");
const { spriteDirName } = require('./sprite-options');
const { DEV_FOLDER, PROD_FOLDER, CONFIG_JS_ENTRY, CSS_OUTPUT_STYLE } = require('./config.settings');

module.exports = (mode) => {
  const outputPath = mode === 'production' ? PROD_FOLDER : DEV_FOLDER
  // const cssOutputStyles = { // compressed < expanded
  //   development: 'expanded',
  //   production: 'compressed'
  // }

  const jsPattern = () => {
    const baseOptions = {
      context: 'src',
      from: 'js/**',
      to: path.resolve(__dirname, outputPath),
      noErrorOnMissing: true,
    };
  
    return CONFIG_JS_ENTRY
      ? [
          {
            ...baseOptions,
            globOptions: {
              ignore: ['js/**/index.js'],
            },
          },
        ]
      : [baseOptions];
  };

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
                  // outputStyle: cssOutputStyles[mode]
                  outputStyle: CSS_OUTPUT_STYLE
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
            to: path.resolve(__dirname, outputPath),
            noErrorOnMissing: true,
            globOptions: {
              ignore: ['**/'+ spriteDirName + '*/**'],
            },
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
