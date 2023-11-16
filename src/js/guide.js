(function () {
  "use strict";
  
  // html 태그를 엔티티로 변경하여 하이라이트 적용하는 코드
  const htmlCode = document.querySelectorAll('code.lang-html');
  const codeHighlight = {
    init(codeHtml) {
      // highlight를 위해 html로 읽히지 않게 특수문자 사용
      const escapeHtml = (html) => {
        return html.replace(/[&<>"']/g, match => {
          switch (match) {
            case "&":
              return "&amp;";
            case "<":
              return "&lt;";
            case ">":
              return "&gt;";
            case '"':
              return "&quot;";
            case "'":
              return "&#039;";
            default:
              return match;
          }
        });
      };
      codeHtml.forEach(el => {
        el.innerHTML = escapeHtml(el.innerHTML);
      })
    }
  };
  codeHighlight.init(htmlCode);
  
  // 코드 보기 토글
  $('.c-btn-toggle').on('click', function () {
    $(this).toggleClass('active')
  });
  
  // 메뉴 및 타이틀 클릭시 스크롤 애니메이션
  $('.c-tit .c-tit-link, .c-list-nav a').on('click', function (e) {
    const href = $(this).attr('href');
    const targetOffset = $(href).offset().top;
    const headerHeight = $('header').outerHeight();
  
    $('html, body').animate({
      scrollTop: targetOffset - headerHeight
    }, 300)
  });
  
  const $window = $(window);
  const $cWrapper = $('.c-wrapper');
  $('.c-btn-menu').on('click', function () {
    $cWrapper.toggleClass('menu-on');
  });
  $('.dimmed-nav').on('click', function () {
    $cWrapper.removeClass('menu-on');
  });
  const widCheck = () => {
    const width = $window.innerWidth();
    if (width > 768) {
        $cWrapper.removeClass('menu-on');
    } else {
        $('.c-list-nav a').on('click', function () {
        $cWrapper.removeClass('menu-on');
        })
    }
  }
  widCheck();
  $window.on('resize', widCheck);
})();
