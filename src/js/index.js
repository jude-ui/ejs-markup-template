// userAgent 정보로 html 태그에 클래스 추가
const ua = require('./common/user-agent')
require('./slick-1.9.0.min')

document.addEventListener('DOMContentLoaded', function () {
  const uaClasses = Object.values(ua).join(' ')
  document.querySelector('html').className += `${uaClasses}`;
});
// 노드 모듈로 설치한 라이브러리
const $ = require('jquery');
window.$ = $
window.jQuery = $