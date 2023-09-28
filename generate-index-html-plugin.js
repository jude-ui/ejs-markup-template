const glob = require("glob");
const fs = require("fs");

class GenerateIndexHtmlPlugin {
  constructor() {
    this.ejsList = [];
    this.pages = [];
    this.nonMetaPages = [];
    this.errorMetaPages = [];
  }

  extractMeta(ejsPath) {
    const data = fs.readFileSync(ejsPath, "utf8");
    const meta = data.substring(0, data.indexOf("#%>"))
      .replace(/<%#|\n/g, "")
      .replace(/'/g, '"');
    return meta;
  }

  validMeta(ejsPath) {
    const meta = this.extractMeta(ejsPath);
    if (!meta) {
      return false;
    }
    try {
      const json = JSON.parse(meta);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
  }

  groupPagesByDepth(pages) {
    // 그룹명, 깊이(depth)별로 오름차순 정렬
    const groups = {};

    for (const page of pages) {
      const groupName = page.group;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(page);
    }

    const sortedGroups = Object.fromEntries(
      Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]))
    );

    for (const groupName in sortedGroups) {
      sortedGroups[groupName].sort((a, b) => {
        const depthA = parseInt(a.depth, 10);
        const depthB = parseInt(b.depth, 10);
        return depthA - depthB;
      });
    }

    return sortedGroups;
  }

  logPagesWithoutMetaInfo() {
    console.log('\x1b[33;1m', '========================================')
    console.log('\x1b[33;1m', '페이지 정보 데이터 없는 템플릿 파일 목록')
    console.log('\x1b[33;1m', this.nonMetaPages)
    console.log('\x1b[33;1m', '========================================')
  }

  logPagesWithInvalidMetaInfo() {
    console.log('\x1b[31;1m', '==============================================')
    console.log('\x1b[31;1m', '페이지 정보 데이터 표기 오류 템플릿 파일 목록', '\n')
    console.log('\x1b[31;1m', this.errorMetaPages, '\n')
    console.log('\x1b[31;1m', '==============================================')
  }

  generatePageList() {
    // page-list.json 파일을 생성하는 함수
    const sortedPages = this.groupPagesByDepth(this.pages);
    fs.writeFileSync('src/pages/page-list.json', JSON.stringify(sortedPages));
  }

  apply(compiler) {
    const NAME = "generate-index-html-plugin";

    compiler.hooks.initialize.tap(NAME, async () => {
      // ejsList 변수를 클래스 생성자에서 초기화하고, 
      // 해당 변수를 사용하여 중복되는 코드를 제거
      this.ejsList = glob.sync(`src/pages/**/*.ejs`, {nosort: true})
        .slice(1); // 첫 번째 항목인 index.ejs를 제외

      for (const ejsPath of this.ejsList) {
        const isUnderscored = /\/[^\/]*_.*$/.test(ejsPath);
        const isValid = this.validMeta(ejsPath);
        const meta = this.extractMeta(ejsPath);
        if (!meta) {
          if (!isUnderscored) {
            this.nonMetaPages.push(ejsPath);
          }
        } else if (!isValid) {
          this.errorMetaPages.push(ejsPath);
        } else {
          const metaJson = JSON.parse(meta);
          metaJson.path = ejsPath.replace(/^src\/pages\//, '')
            .replace(/\.ejs$/, '.html');
          this.pages.push(metaJson);
        }
      }
      
      // 페이지 메타 정보가 없는 것을 잡아냄
      if (this.nonMetaPages.length > 0) {
        this.logPagesWithoutMetaInfo();
      }

      // 페이지 메타 정보의 에러를 잡아냄
      if (this.errorMetaPages.length > 0) {
        this.logPagesWithInvalidMetaInfo();
      }

      this.generatePageList();
    });
  }
}

module.exports = GenerateIndexHtmlPlugin;