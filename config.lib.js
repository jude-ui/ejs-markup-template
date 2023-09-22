const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');

// 3가지 옵션 중 1개만 true로 설정 필요
const spriteRatioOptions = {
  basicRatio: false, // 1배 이미지만 사용하여 스프라이트를 구성하고 싶을 경우(retinaSuffix 값 무시됨)
  retinaOnly: false, // 2배 이미지만 사용하여 스프라이트를 구성하고 싶을 경우(retinaSuffix 값 무시됨)
  withRetina: true, // 1배와 2배 이미지 모두 사용하여 스프라이트를 구성하고 싶을 경우 true(retinaSuffix 값 필수)
}
const retinaSuffix = '@2x'; // retina 이미지를 구분하는 이미지명의 접미사(suffix)
const spriteCssOutputPath = '/css'; // sprite css가 빌드될 폴더 경로
const irCss = 'display:block;overflow:hidden;font-size:1px;line-height:0;color:transparent'; // 모바일 ir 클래스(프로젝트에 따라 변경)

exports.configJsEntry = true

exports.ejsEntries = () => {
  let result = {}
  const ejsList = glob.sync(`src/pages/**/*.ejs`)

  ejsList.forEach(item => {
    const key = item.replace(/^src\/pages\//, 'js-from-html/')
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
  const templates = glob.sync('src/pages/**/[!_]*.ejs');
  return templates.map((template) => {
    let filename = template
      .replace(/^src\/pages/, 'html')
      .replace(/\.ejs$/, '.html');
    if (filename === 'html/page-list.html') {
      filename = 'html/index.html';
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
  const spriteDirs = glob.sync('src/images/sprites*/*');

  const getDirName = (dir) => dir.match(/([^/]+$)/)[0];
  
  // 빌드되는 sprite 이미지 경로 및 이름
  const getSpriteImagePath = (dir, outputPath) => {
    const dirname = dir.replace(/\/[^/]+$/, '');
    const outputDirname = dirname.replace(/^src/, outputPath);
    const spriteName = `sprites-${getDirName(dir)}`;
    
    return outputDirname.replace(/sprites/, spriteName);
  };
  
  const getCssFileName = (dir) => {
    const dirname = dir.replace(/\/[^/]+$/, '');
    const spriteName = `sprites-${getDirName(dir)}`;
    const cssOutputDirname = `src${spriteCssOutputPath}`;
    
    return dirname.replace(/^src\/images/, cssOutputDirname).replace(/sprites/, spriteName);
  };

  const getTemplateFunction = (spriteRatioOptions) => {
    const { basicRatio, retinaOnly, withRetina } = spriteRatioOptions;
    
    const getGeneralSpriteCss = (generalData) => {
      const { image, width, height } = generalData;
      const folderName = image.split('-')[1].match(/(.*)\./)[1];
      const backgroundSize = retinaOnly
        ? `${width/2}px ${height/2}px`
        : `${width}px ${height}px`;

      return `.${folderName}_comm{${irCss};background:url(${image}) 0 0 no-repeat;background-size:${backgroundSize}}`;
    }
    
    const getGeneralCss = (sprites) => {
      return sprites.map((sprite) => {
        const width = retinaOnly ? sprite.width/2 : sprite.width;
        const height = retinaOnly ? sprite.height/2 : sprite.height;
        const offset_x = retinaOnly ? sprite.offset_x/2 : sprite.offset_x;
        const offset_y = retinaOnly ? sprite.offset_y/2 : sprite.offset_y;

        return `.${sprite.name}{width:${width}px;height:${height}px;background-position:${offset_x}px ${offset_y}px}`;
      }).join('\n');
    };

    const templateFunction = (data) => {
      const generalSpriteCss = getGeneralSpriteCss(data.spritesheet);
      const generalCss = getGeneralCss(data.sprites);
      
      if (retinaOnly) {
        return `${generalSpriteCss}\n${generalCss}`;
      } else if (withRetina) {
        const generalData = data.spritesheet;
        const folderName = generalData.image.split('-')[1].match(/(.*)\./)[1];
        const retinaMediaQuery = `@media\nonly screen and (-webkit-min-device-pixel-ratio: 1.5),\nonly screen and (min-device-pixel-ratio: 1.5),\nonly screen and (min-resolution: 144dpi),\nonly screen and (min-resolution: 1.5dppx) {`;
        const retinaSpriteCss = `  .${folderName}_comm{background-image:url(${data.retina_spritesheet.image})}`;
        return `${generalSpriteCss}\n${generalCss}\n\n${retinaMediaQuery}\n${retinaSpriteCss}\n}`;
      } else {
        return `${generalSpriteCss}\n${generalCss}`;
      }
    };
    
    const templateType = (basicRatio || retinaOnly) ? 'function_based_template' : 'function_based_template_retina';
    return { [templateType]: templateFunction }
  }

  return spriteDirs.map((dir) => {
    const pluginOptions = {
      src: {
        cwd: path.resolve(__dirname, dir),
        glob: '**/*'
      },
      target: {
        image: path.resolve(__dirname, `${getSpriteImagePath(dir, outputPath)}.png`),
        css: [
          [path.resolve(__dirname, `${getCssFileName(dir)}.css`), {
            format: 'function_based_template'
          }],
        ]
      },
      customTemplates: getTemplateFunction(spriteRatioOptions),
      apiOptions: {
        cssImageRef: `../${getSpriteImagePath(dir, outputPath).replace(/^(dev|build)\//, '')}.png`,
        generateSpriteName: (path) => {
          const fileName = path.substring(path.lastIndexOf('/') + 1).replace('.png', '')
          return `${getDirName(dir)}_${fileName}`
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
  })
}