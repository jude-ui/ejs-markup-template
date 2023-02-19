const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

exports.isUseCss = false //css 사용시 false로 변경

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
      .replace(/^src\/images/,'src/css')
  }
  return dirs.map(dir => {
    return new SpritesmithPlugin({
      src: {
        cwd: path.resolve(__dirname, dir),
        glob: '**/*'
      },
      target: {
        image: path.resolve(__dirname, `${spriteImagePath(dir)}.png`),
        css: path.resolve(__dirname, `${cssFileName(dir)}.css`)
      },
      apiOptions: {
        cssImageRef: `../${spriteImagePath(dir).replace(/^(dev|build)\//,'')}.png`,
        generateSpriteName: (path) => {
          const fileName = path.substring(path.lastIndexOf('/') + 1).replace('.png', '')
          return `${dirName(dir)}_${fileName}`.replace('icon-', '');
        },
      },
      spritesmithOptions: {
        padding: 10
      },
      // 레티나 이미지 없을 경우 제거
      retina: "@2x"
    })
  })
}
