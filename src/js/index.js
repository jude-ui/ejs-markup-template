// userAgent 정보로 html 태그에 클래스 추가 (깃틀 마이그레이션을 위해 기존과 동일하게 되도록 함)
const ua = require('./common/user-agent')
document.addEventListener('DOMContentLoaded', function () {
  const uaClasses = Object.values(ua).join(' ')
  document.querySelector('html').className += `${uaClasses}`;
})

// 노드 모듈로 설치한 라이브러리
const $ = require('jquery');
window.$ = $
window.jQuery = $