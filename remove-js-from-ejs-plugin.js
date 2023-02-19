class RemoveJsFromEjsPlugin {

  apply(compiler) {
    const NAME = 'remove-js-from-ejs-plugin';

    compiler.hooks.compilation.tap(NAME, compilation => {

      compilation.hooks.chunkAsset.tap(NAME, (chunk, file) => {
        const regex = /^(js\/js-from-html|js-from-html)/
        if(regex.test(file)) {
          compilation.deleteAsset(file);
        }
      });
    });
  }
}

module.exports = RemoveJsFromEjsPlugin;