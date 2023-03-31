const { sources } = require('webpack');

class CssOutputPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const NAME = 'css-output-plugin';

    if (this.shouldApplyPlugin()) {
      compiler.hooks.compilation.tap(NAME, this.processAssets.bind(this));
    }
  }

  shouldApplyPlugin() {
    return this.options.useSourceMap === false || this.options.mode === 'production';
  }

  processAssets(compilation) {
    const assets = compilation.getAssets();
    const cssAssets = assets.filter(asset => /^css\//.test(asset.name));

    cssAssets.forEach(asset => {
      let content = asset.source.source();

      if (this.options.outputStyle === 'compressed') {
        content = '@charset "UTF-8";' + content;
      } else if (this.options.outputStyle === 'compact') {
        content = this.normalizeCss(content);
      }

      const newAsset = new sources.RawSource(content);
      compilation.updateAsset(asset.name, newAsset);
    });
  }

  normalizeCss(css) {
    return css.replace(/^\s*\n/gm, '')
              .replace(/\,\s/g, ',')
              .replace(/\s{\s/g, '{')
              .replace(/;\s/gm, ';')
              .replace(/:\s/g, ':');
  }
}

module.exports = CssOutputPlugin;