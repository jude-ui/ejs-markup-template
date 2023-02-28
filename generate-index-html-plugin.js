const glob = require("glob");
const fs = require("fs");

class GenerateIndexHtmlPlugin {

  extractMeta(ejsPath) {
    const data = fs.readFileSync(ejsPath, "utf8")
    const meta = data.substring(0, data.indexOf("#%>"))
    .replace(/<%#|\n/g, "")

    return meta
  }

  vaildMeta(ejsPath) {
    const data = fs.readFileSync(ejsPath, "utf8")
    const meta = data.substring(0, data.indexOf("#%>"))
      .replace(/<%#|\n/g, "")
    try {
      var json = JSON.parse(meta);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

  comp(a, b) {
    return a > b? 1 : a < b ? -1 : 0
  }

  reducer(accumulator, page) {
    const groupName = page.group;
    if (accumulator.hasOwnProperty(groupName)) {
      accumulator[groupName].push(page);
    } else {
      accumulator[groupName] = [page];
    }
    return accumulator;
  }

  apply(compiler) {
    const NAME = "generate-index-html-plugin";

    compiler.hooks.initialize.tap(NAME, async () => {
      let ejsList = glob.sync(`src/templates/pages/**/*.ejs`, {nosort: true})

      ejsList = ejsList.slice(1, ejsList.length)

      const pages = []
      const nonMetaPages = []
      const errorMetaPages = []

      ejsList.forEach(ejsPath => {
        const regex = /\/[^\/]*_.*$/;
        const isUnderscored = regex.test(ejsPath);
        
        const vaild = this.vaildMeta(ejsPath)
        const meta = this.extractMeta(ejsPath)
        if (!meta) {
          if (!isUnderscored) {
            nonMetaPages.push(ejsPath)
          }
        } else {
          if(!vaild) {
            errorMetaPages.push(ejsPath)
          } else {
            const metaJson = JSON.parse(meta)
            metaJson.path = ejsPath.replace(/^src\/templates\/pages\//, '')
              .replace(/\.ejs$/, '.html')
            pages.push(metaJson)
          }
        }
      })

      if(nonMetaPages.length > 0) {
        console.log('\x1b[33;1m', '========================================')
        console.log('\x1b[33;1m', '페이지 정보 데이터 없는 템플릿 파일 목록')
        console.log('\x1b[33;1m', nonMetaPages)
        console.log('\x1b[33;1m', '========================================')
      }

      if(errorMetaPages.length > 0) {
        console.log('\x1b[31;1m', '==============================================')
        console.log('\x1b[31;1m', '페이지 정보 데이터 표기 오류 템플릿 파일 목록', '\n')
        console.log('\x1b[31;1m', errorMetaPages, '\n')
        console.log('\x1b[31;1m', '==============================================')
      }

      const groups = pages.reduce(this.reducer, {});

      for(let key in groups) {
        groups[key].sort((a, b) => {
            return this.comp(a.depth1, b.depth1) || this.comp(a.depth2, b.depth2)
              || this.comp(a.depth3, b.depth3) || this.comp(a.depth4, b.depth4)
        });
      }

      const result = Object.keys(groups).sort().reduce((acc, key) => {
        acc[key] = groups[key];
        return acc
      }, {})

      fs.writeFileSync('src/templates/pages/page-list.json', JSON.stringify(result))

    });

  }
}

module.exports = GenerateIndexHtmlPlugin;
