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

  // page-list.json 에 들어갈 정보를 만드는 함수
  groupPagesByDepth(pages) {
    // 그릅명을 키값으로 하는 정렬되지 않은 객체 생성
    const newGroups = {};
    for (const page of pages) {
      const groupName = page.group;
      if (!newGroups[groupName]) {
        newGroups[groupName] = [];
      }
      newGroups[groupName].push(page);
    }

    // 숫자를 기준으로 문자열을 오름차순으로 정렬 기능
    const sortByNumeric = ( a, b ) => {
      // 숫자가 없는 항목은 다른 항목보다 앞에 오도록 비교
      if (!/^\d/.test(a) && /^\d/.test(b)) return -1;
      if (/^\d/.test(a) && !/^\d/.test(b)) return 1;
    
      // 숫자가 있는 항목들은 숫자로 비교
      const numA = parseInt(a.match(/\d+/)) || 0;
      const numB = parseInt(b.match(/\d+/)) || 0;
      if (numA !== numB) {
        return numA - numB;
      }
      
      // 숫자가 같을 경우, 나머지 문자열을 비교
      const strA = a.replace(/^\d+/, '');
      const strB = b.replace(/^\d+/, '');
      
      return strA.localeCompare(strB);
    }

    // newGroups 객체의 키 값들로 배열 생성 및 배열 오름차순 정렬
    const sortedKeys = Object.keys(newGroups).slice().sort((a, b) => {
      return sortByNumeric(a, b);
    });

    // 오름차순 그룹명이 정렬된 배열에 파일 정보를 연결한 객체 생성
    const resultFileIndex = {};
    for (const key of sortedKeys) {
      resultFileIndex[key] = newGroups[key];
    }

    for (const groupName in resultFileIndex) {
      resultFileIndex[groupName].sort((a, b) => {
        return sortByNumeric(a.depth, b.depth);
      });
    }

    return resultFileIndex;
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
    fs.writeFileSync('src/pages/index.json', JSON.stringify(sortedPages));
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