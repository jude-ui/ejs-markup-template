const glob = require('glob');
const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const { spriteDirName, _spriteSourcesPath, spriteRatioOptions, retinaSuffix, spriteCssOutputPath, irCss } = require('./sprite-options');

exports.ejsEntries = () => {
  let result = {}
  const ejsList = glob.sync(`src/pages/**/*.ejs`)

  ejsList.forEach(item => {
    const key = item.replace(/^src\/pages\//, 'js-from-html/')
    .replace(/\.ejs$/, '')
    const value = "./" + item
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
    const value = "./" + item
    result[key] = value
  })

  return result
}

exports.jsEntries = () => {
  let result = {}
  const jsList = glob.sync('src/js/*.js')

  jsList.forEach(item => {
    let key = item.replace(/^src\/js\//, '')
    .replace(/\.js$/, '')

    // 파일명이 'index.js'일 때만 엔트리 객체에 추가
    if (key === 'index' && fs.statSync(item).isFile()) {
      const value = `./${item}`
      result[key] = value
    }
  })

  return result
}

exports.HtmlWebpackPlugins = () => {
  const templates = glob.sync('src/pages/**/[!_]*.ejs');
  return templates.map((template) => {
    let filename = template
      .replace(/^src\/pages/, 'html')
      .replace(/\.ejs$/, '.html');
    if (filename === 'html/page-list.html') {
      filename = 'index.html';
    }
    return new HtmlWebpackPlugin({
      template,
      filename,
      inject: false,
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    })
  });
}

exports.sprites = (outputPath) => {
  // outputPath는 'build' or 'dev'
  const spriteDirsPaths = glob.sync(_spriteSourcesPath);

  const getDirName = (dirPath) => dirPath.split('/').pop();
  
  // 빌드되는 sprite 이미지 경로 및 이름
  const getSpriteImageName = (dirPath, outputPath, spriteDirName) => {
    const spPath = dirPath
      .replace(/^(.*?)\//, `${outputPath}/`)
      .replace(/\/[^/]+\/([^/]+)$/, '/');
    
    return `${spPath}${spriteDirName}-${getDirName(dirPath)}`
  };

  const getCssFileName = (dirPath, spriteDirName) => {
    return dirPath
      .replace(/\/[^/]+$/, '')
      .replace(/\/[^/]*\//, `${spriteCssOutputPath}/`)
      .replace(/\/[^/]+$/, `/${spriteDirName}-${getDirName(dirPath)}`)
  };

  const { basicRatio, retinaOnly, withRetina } = spriteRatioOptions;
  const getTemplateFunction = () => {
    const getSpriteCommonCss = (generatedSpriteData) => {
      const { image, width, height } = generatedSpriteData;
      const folderName = image.split('-')[1].match(/(.*)\./)[1];
      const backgroundSize = retinaOnly
        ? `${width/2}px ${height/2}px`
        : `${width}px ${height}px`;

      return `@charset "utf-8";\n.[DIR_NAME]_comm{[IR_CSS];background:url([IMG]) 0 0 no-repeat;background-size:[BG_SIZE]}`
        .replace('[DIR_NAME]', folderName)
        .replace('[IR_CSS]', irCss)
        .replace('[IMG]', image)
        .replace('[BG_SIZE]', backgroundSize)
    }
    
    const getSpriteGeneralImageCss = (sprites) => {
      return sprites.map((sprite) => {
        const width = retinaOnly ? sprite.width/2 : sprite.width;
        const height = retinaOnly ? sprite.height/2 : sprite.height;
        const offset_x = retinaOnly ? sprite.offset_x/2 : sprite.offset_x;
        const offset_y = retinaOnly ? sprite.offset_y/2 : sprite.offset_y;

        return `.${sprite.name}{width:[W]px;height:[H]px;background-position:[X]px [Y]px}`
          .replace('[W]', width)
          .replace('[H]', height)
          .replace('[X]', offset_x)
          .replace('[Y]', offset_y)
      }).join('\n');
    };

    const templateFunction = (data) => {
      const commonSpriteCss = getSpriteCommonCss(data.spritesheet);
      const generalCss = getSpriteGeneralImageCss(data.sprites);
      
      if (retinaOnly) {
        return `${commonSpriteCss}\n${generalCss}`;
      } else if (withRetina) {
        const generalData = data.spritesheet;
        const folderName = generalData.image.split('-')[1].match(/(.*)\./)[1];
        const retinaMediaQuery =  '@media' + `\n` +
                                  'only screen and (-webkit-min-device-pixel-ratio: 1.5),' + `\n` +
                                  'only screen and(min-device-pixel-ratio: 1.5),' + `\n` +
                                  'only screen and(min-resolution: 144dpi),' + `\n` +
                                  'only screen and(min-resolution: 1.5dppx)';
        const retinaSpriteCss = `  .${folderName}_comm{background-image:url(${data.retina_spritesheet.image})}`;
        
        return  commonSpriteCss + '\n' +
                generalCss + '\n\n' +
          
                retinaMediaQuery + ` {\n` +
                retinaSpriteCss + '\n' +
              '}';
      } else {
        return `${commonSpriteCss}\n${generalCss}`;
      }
    };
    
    const templateType = (basicRatio || retinaOnly) ? 'function_based_template' : 'function_based_template_retina';
    return { [templateType]: templateFunction }
  }

  return (!basicRatio && !retinaOnly && !withRetina)
    ? []
    : spriteDirsPaths.map((dirPath) => {
      // ex. dirPath === 'src/images/sprites/ico'
      const pluginOptions = {
        src: {
          cwd: path.resolve(__dirname, dirPath),
          glob: '**/*'
        },
        target: {
          image: path.resolve(__dirname, `${getSpriteImageName(dirPath, outputPath, spriteDirName)}.png`),
          css: [
            [path.resolve(__dirname, `${getCssFileName(dirPath, spriteDirName)}.css`), {
              format: 'function_based_template'
            }],
          ]
        },
        customTemplates: getTemplateFunction(),
        apiOptions: {
          cssImageRef: `../${getSpriteImageName(dirPath, outputPath, spriteDirName).replace(/^(dev|build)\//, '')}.png`,
          generateSpriteName: (path) => {
            const fileName = path.substring(path.lastIndexOf('/') + 1).replace('.png', '')
            return `${getDirName(dirPath)}_${fileName}`
          },
        },
        spritesmithOptions: {
          padding: 10
        },
      }

      if (spriteRatioOptions.withRetina) {
        pluginOptions.retina = retinaSuffix
      }

      return new SpritesmithPlugin(pluginOptions);
    });
}