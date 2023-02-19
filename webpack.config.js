const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config-comm');
const productionConfig = require('./webpack.config-prod');
const developmentConfig = require('./webpack.config-dev');

module.exports = (env, argv) => {
  switch(argv.mode) {
    case 'development':
      return merge(commonConfig(argv.mode), developmentConfig);
    case 'production':
      return merge(commonConfig(argv.mode), productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}