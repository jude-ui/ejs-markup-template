const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

const isRetina = true // sprite retina 이미지 사용 여부
const retinaName = "@2x" // retina 이미지를 구분하는 이미지명의 접미사(suffix)
const cssSpSrc = '/css' // sprite css가 빌드될 폴더 경로
exports.configJsEntry = true

exports.ejsEntries = () => {
  let result = {}
  const ejsList = glob.sync(`src/templates/pages/**/*.ejs`)

  ejsList.forEach(item => {
    const key = item.replace(/^src\/templates\/pages\//, 'js-from-html/')
    .replace(/\.ejs$/, '')
    const value = "./" + item;
    result[key] = value
  })

  return result
}

exports.cssEntries = () => {
  let result = {}
  const scssList = glob.sync(`src/css/*.scss`)

  scssList.forEach(item => {
    const key = item.replace(/^src\/css\//, '')
    .replace(/\.scss$/, '')
    const value = "./" + item;
    result[key] = value
  })

  return result
}

exports.jsEntries = () => {
  let result = {}
  const jsList = glob.sync(`src/js/*.js`)

  jsList.forEach(item => {
    let key = item.replace(/^src\/js\//, '')
    .replace(/\.js$/, '')

    key = key === 'index'? 'main': key

    const value = "./" + item;
    result[key] = value
  })

  return result
}

exports.HtmlWebpackPlugins = () => {
  const templates = glob.sync(`src/templates/pages/**/[!_]*.ejs`)
  return templates.map(item => {
    let fileName = item.replace(/^src\/templates\/pages/, 'html')
                  .replace(/\.ejs$/, '.html')
    if(fileName === 'html/page-list.html') {
      fileName = 'html/index.html'
    }
    return new HtmlWebpackPlugin({
      template: item,
      filename: fileName,
      inject: false,
      minify: false
    })
  });
}

exports.sprites = (outputPath) => {
  const context = 'src/images/'
  const dirs = glob.sync(`${context}sprites*/*`)

  const dirName = (dir) => {
    return dir.match(/([^/]+$)/)[0]
  }

  const spriteImagePath = (dir) => {
    return dir.substring(0, dir.lastIndexOf('/'))
      .replace(/^src/, outputPath)
      .replace(/sprites/, `sprites-${dirName(dir)}`)
  }

  const cssFileName = (dir) => {
    return dir.substring(0, dir.lastIndexOf('/'))
      .replace(/sprites/, `sprites-${dirName(dir)}`)
      .replace(/^src\/images/,`src${cssSpSrc}`)
  }
  
  const templateFunction = data => {
    const info = data.sprites[0];
    const folderName = info.name.split('_')[0];
    const cssCommSp = `.${folderName}_comm{width:${info.total_width}px;height:${info.total_height}px;background:url(${info.image}) 0 0 no-repeat;background-size:${info.total_width}px ${info.total_height}px}`;
    const cssData1 = data.sprites.map(sprite => `.${sprite.name}{width:${sprite.width}px;height:${sprite.height}px;background-position:${sprite.offset_x}px ${sprite.offset_y}px}`).join('\n');

    return`${cssCommSp}\n${cssData1}`;
  };

  const templateFunctionRetina = data => {
    const info = data.sprites[0];
    const folderName = info.name.split('_')[0];
    const cssCommSp = `.${folderName}_comm{width:${info.total_width}px;height:${info.total_height}px;background:url(${info.image}) 0 0 no-repeat;background-size:${info.total_width}px ${info.total_height}px}`;
    const cssData1 = data.sprites.map(sprite => `.${sprite.name}{width:${sprite.width}px;height:${sprite.height}px;background-position:${sprite.offset_x}px ${sprite.offset_y}px}`).join('\n');

    const infoRetina = data.retina_sprites[0];
    const retinaFolderName = infoRetina.name.split('_')[1];
    const cssCommSpRetina = `  .${retinaFolderName}_comm{background-image:url(${infoRetina.image})}`;
    const cssData2 = data.retina_sprites.map(sprite => `  .${sprite.name.replace('retina_', '')}{background-position:${sprite.offset_x}px ${sprite.offset_y}px}`).join('\n');
    const ratioBefore = `@media\nonly screen and (-webkit-min-device-pixel-ratio: 1.5),\nonly screen and (min-device-pixel-ratio: 1.5),\nonly screen and (min-resolution: 144dpi),\nonly screen and (min-resolution: 1.5dppx) {`;
    
    return`${cssCommSp}\n${cssData1}\n\n${ratioBefore}\n${cssCommSpRetina}\n${cssData2}\n}`;
  };
  
  const isTemplateRetina = isRetina => ({
    [isRetina ? 'function_based_template_retina' : 'function_based_template']: isRetina ? templateFunctionRetina : templateFunction
  })

  return dirs.map(dir => {
    const pluginOptions = {
      src: {
        cwd: path.resolve(__dirname, dir),
        glob: '**/*'
      },
      target: {
        image: path.resolve(__dirname, `${spriteImagePath(dir)}.png`),
        css: [
          [path.resolve(__dirname, `${cssFileName(dir)}.css`), {
            format: 'function_based_template'
          }],
        ]
      },
      customTemplates: isTemplateRetina(isRetina),
      apiOptions: {
        cssImageRef: `../${spriteImagePath(dir).replace(/^(dev|build)\//, '')}.png`,
        generateSpriteName: (path) => {
          const fileName = path.substring(path.lastIndexOf('/') + 1).replace('.png', '')
          return `${dirName(dir)}_${fileName}`
        },
      },
      spritesmithOptions: {
        padding: 10
      },
    }

    if (isRetina) {
      pluginOptions.retina = retinaName
    }

    return new SpritesmithPlugin(pluginOptions)
  })
}
