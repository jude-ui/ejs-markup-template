const { Compilation, sources } = require('webpack');

class CssOutputPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    const NAME = 'css-output-plugin';

    if(this.options.useSourceMap === false || this.options.mode === 'production') {
      compiler.hooks.compilation.tap(NAME, compilation => {

        compilation.hooks.processAssets.tap(
          {
            name: NAME,
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          (assets) => {
            Object.entries(assets).forEach(([pathname, source]) => {
              const regex = /^css\//
              if(regex.test(pathname)) {
                const file = compilation.getAsset(pathname)
                if(this.options.outputStyle === 'compressed') {
                  compilation.updateAsset(pathname,
                    new sources.RawSource('@charset "UTF-8";' + file.source.source())
                  )
                } else if(this.options.outputStyle === 'compact') {
                  const updateContent = (file.source.source() + '').replace(/^\s*\n/gm, '')
                  .replace(/\,\s/g, ',')
                  .replace(/\s{\s/g, '{')
                  .replace(/;\s/gm, ';')
                  .replace(/:\s/g, ':')
                  compilation.updateAsset(pathname,
                    new sources.RawSource(updateContent)
                  )
                }
              }
            });
          }
        );

      });
    }
  }
}

module.exports = CssOutputPlugin;