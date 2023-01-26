"use strict";

$(function () {
  $("#filter").click(function () {
    $("#filterMenu").show();
    $("#sortMenu").hide();
  });
  $("#sort").click(function () {
    $("#sortMenu").show();
    $("#filterMenu").hide();
  });
  $(".xi-close").click(function () {
    $("#filterMenu").hide();
    $("#sortMenu").hide();
  });
}); // nav 상단 고정
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