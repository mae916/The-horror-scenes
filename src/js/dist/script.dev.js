"use strict";

//레이어 팝업 on인 경우 body 스크롤 막기
var body = document.getElementsByTagName("body")[0];
$(function () {
  $("#filter").click(function () {
    $("#filterMenu").show();
    $("#sortMenu").hide();
    body.classList.add("scrollLock");
  });
  $("#sort").click(function () {
    $("#sortMenu").show();
    $("#filterMenu").hide();
    body.classList.add("scrollLock");
  });
  $(".xi-close").click(function () {
    $("#filterMenu").hide();
    $("#sortMenu").hide();
    body.classList.remove("scrollLock");
  });
});