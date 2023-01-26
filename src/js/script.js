// 검색 창
$(function () {
  $("#search").click(function () {
    $("#searchMenu").show();
  });

  $(".xi-close").click(function () {
    $("#searchMenu").hide();
  });
});

// nav 상단 고정
// $(function () {
//   const navOffset = $(".top_fixed").offset();
//   $(window).scroll(function () {
//     if ($(window).scrollTop() > navOffset.top) {
//       $(".top_fixed").addClass("fixed-nav");
//     } else {
//       $(".top_fixed").removeClass("fixed-nav");
//     }
//   });
// });
