const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.config-comm');
const productionConfig = require('./webpack.config-prod');
const developmentConfig = require('./webpack.config-dev');
const fs = require('fs');
const devServerConfig = fs.existsSync('./dev-server-config.js') ? require('./dev-server-config') : false;
const defaultPort = devServerConfig && devServerConfig['DEV_SERVER_PORT'] ? devServerConfig['DEV_SERVER_PORT'] : 8080;
const portfinder = require('portfinder');

module.exports = async (env, argv) => {
  // 기존 설정 가져오기
  const common = commonConfig(argv.mode);
  let config;

  switch (argv.mode) {
    case 'development':
      config = developmentConfig;
      break;
    case 'production':
      config = productionConfig;
      break;
    default:
      throw new Error('No matching configuration was found!');
  }

  // 사용 가능한 포트 찾기
  const port = await portfinder.getPortPromise({
    port: defaultPort, // 기본 포트
  });

  // 개발 서버 포트 설정 업데이트
  if (config.devServer) {
    config.devServer.port = port;
  }

  // 최종 설정을 합쳐 반환
  return merge(common, config);
};
