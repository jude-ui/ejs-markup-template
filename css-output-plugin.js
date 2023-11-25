const { sources, Compilation } = require('webpack');

class CssOutputPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const NAME = 'css-output-plugin';
    if (this.options.mode === 'production') {
      compiler.hooks.compilation.tap(NAME, (compilation) => {
        compilation.hooks.processAssets.tapAsync(
          {
            name: NAME,
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
          },
          (assets, callback) => {
            Object.keys(assets).forEach((assetName) => {
              // 자원중에서 CSS 파일을 찾고 처리
              if (assetName.endsWith('.css')) {
                let content = assets[assetName].source();

                const newAsset = new sources.RawSource(content);
                compilation.updateAsset(assetName, newAsset);
              }
            });

            callback();
          }
        );
      });
    }
  }
}

module.exports = CssOutputPlugin;