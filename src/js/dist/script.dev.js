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
  $("#filterMenu .category").click(function () {
    var nation = $(this).data("nation");
    $.ajax({
      url: "/get_movie?nation=".concat(nation),
      type: "get",
      success: function success(data) {
        location.replace("/get_movie?nation=".concat(nation));
      },
      error: function error(request, status, _error) {
        console.log("code: " + request.status);
        console.log("message: " + request.responseText);
        console.log("error: " + _error);
      }
    });
  });
});