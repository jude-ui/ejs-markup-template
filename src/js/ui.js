$(function () {
  "use strict";
  $(document).ready(function () {
    console.log('after document loading');
  });

  // 이미지 로딩 후 호출
  // window.onload = function () {
  //   console.log('after image loading');
  // }
  $(window).on('load', function () {
    console.log('after image load')
  });
});