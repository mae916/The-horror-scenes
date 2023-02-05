"use strict";

//레이어 팝업 on인 경우 body 스크롤 막기
var body = document.getElementsByTagName("body")[0];
$(function () {
  $("#filter").click(function () {
    $("#filterMenu").show();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.add("scrollLock");
  });
  $("#sort").click(function () {
    $("#sortMenu").show();
    $("#filterMenu").hide();
    $("#orderMenu").hide();
    body.classList.add("scrollLock");
  });
  $("#order").click(function () {
    $("#orderMenu").show();
    $("#filterMenu").hide();
    $("#sortMenu").hide();
    body.classList.add("scrollLock");
  });
  $(".xi-close").click(function () {
    $("#filterMenu").hide();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.remove("scrollLock");
  });
  $(".category").click(function (e) {
    var nation = $(this).data("nation");
    var sort = $(this).data("sort");
    var order = $(this).data("order"); //선택한 카테고리를 세션에 저장함

    if (nation === undefined) {
      if (sessionStorage.nation === undefined) {
        nation = "";
      } else {
        nation = sessionStorage.nation;
      }
    }

    if (sort === undefined) {
      if (sessionStorage.sort === undefined) {
        sort = "prodYear";
      } else {
        sort = sessionStorage.sort;
      }
    }

    if (order === undefined) {
      if (sessionStorage.order === undefined) {
        order = "1";
      } else {
        order = sessionStorage.order;
      }
    }

    sessionStorage.setItem("nation", nation);
    sessionStorage.setItem("sort", sort);
    sessionStorage.setItem("order", order);
    var sNation = sessionStorage.getItem("nation");
    var sSort = sessionStorage.getItem("sort");
    var sOrder = sessionStorage.getItem("order");
    var cateArr = {
      nation: sNation,
      sort: sSort,
      order: sOrder
    };
    process(cateArr); //새로고침시 이전 세션에 저장한 카테고리 내역 삭제

    $(window).bind("beforeunload", function () {
      sessionStorage.clear();
    });

    function process(cateArr) {
      var data, list, el, no, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, li, childEl, filter, sortFilter, orderFilter;

      return regeneratorRuntime.async(function process$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(ajaxLoad('/get_movie', {
                cateArr: cateArr
              }));

            case 3:
              data = _context.sent;
              // ajaxLoad내에 프라미스에서 반환된 resolve(data)
              list = data.list;
              el = document.querySelector(".movie_info");

              if (el) {
                _context.next = 8;
                break;
              }

              throw new Error("movie_info 요소 없음.");

            case 8:
              no = 1;
              el.innerHTML = "";
              _iteratorNormalCompletion = true;
              _didIteratorError = false;
              _iteratorError = undefined;
              _context.prev = 13;

              for (_iterator = list[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                li = _step.value;
                childEl = getContentDOM(li, no);
                el.appendChild(childEl);
                no++;
              } // navigation 이름 바꿔주기


              _context.next = 21;
              break;

            case 17:
              _context.prev = 17;
              _context.t0 = _context["catch"](13);
              _didIteratorError = true;
              _iteratorError = _context.t0;

            case 21:
              _context.prev = 21;
              _context.prev = 22;

              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }

            case 24:
              _context.prev = 24;

              if (!_didIteratorError) {
                _context.next = 27;
                break;
              }

              throw _iteratorError;

            case 27:
              return _context.finish(24);

            case 28:
              return _context.finish(21);

            case 29:
              filter = document.getElementById("filter");
              sortFilter = document.getElementById("sort");
              orderFilter = document.getElementById("order");
              filter.innerHTML = data.nationEn;
              sortFilter.innerHTML = data.sort;
              orderFilter.innerHTML = data.orderNm;
              _context.next = 40;
              break;

            case 37:
              _context.prev = 37;
              _context.t1 = _context["catch"](0);
              console.error(_context.t1);

            case 40:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 37], [13, 17, 21, 29], [22,, 24, 28]]);
    }

    $("#filterMenu").hide();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.remove("scrollLock");
    $(window).scrollTop(0);
  });
});

function ajaxLoad(url, data) {
  return new Promise(function (resolve, reject) {
    //resolve(value) : 일이 성공적으로 끝난 경우 그 결과를 나타내는 value와 함께 호출
    //reject(error) : 에러 발생 시 에러 객체를 나타내는 error와 함께 호출
    // 이 안에 코드(제작코드)가 준비 되면 new Promise는 다른 함수(ajaxLoad, 소비코드)에서 사용할 수 있도록 도와줌
    var xhr = new XMLHttpRequest(); //XMLHttpRequest 객체 생성

    var params = new URLSearchParams(); //URL의 파라미터 값을 확인

    if (data) {
      for (var key in data) {
        var cate = data[key];

        for (var index in cate) {
          params.append(index, cate[index]); //append(추가할 매개변수의 이름, 추가할 매개변수의 값) : 지정한 키/값 쌍을 새로운 검색 매개변수로서 추가
        }
      }

      if (url.indexOf("?") == -1) {
        //?가 없으면 추가
        url += "?";
      }

      url += params.toString(); //URL에서 사용하기에 적합한 쿼리 문자열을 반환
    }

    xhr.open("GET", url); // http 요청 초기화

    xhr.send(null); // http 요청 전송

    xhr.onreadystatechange = function () {
      // readystate 프로퍼티 값이 변경된 경우
      if (xhr.status == 200 && xhr.readyState == XMLHttpRequest.DONE) {
        var _data = JSON.parse(xhr.responseText); // 서버가 전송한 http 요청에 대한 응답 문자열(responseText)을 객체로 변환


        resolve(_data); //성공적으로 끝났다는 신호가 전달되면서 result는 data 값이 됨.
      }
    };

    xhr.onerror = function (err) {
      reject(err); // 에러와 함께 실행이 종료되었다는 신호를 보냄.
    };
  });
}

function getContentDOM(data, no) {
  var tpl = document.getElementById("tpl");
  if (!tpl) return;
  var html = tpl.innerHTML;
  html = html.replace(/<data>movieName<\/data><data>repRlsDate<\/data>/g, "".concat(data.title, " ").concat(data.repRlsDate)).replace(/<data>director<\/data>/g, data.director).replace(/<data>no<\/data>/g, no).replace(/<data>poster<\/data>/g, data.poster).replace(/<data>plot<\/data>/g, data.plot).replace(/<data>keywords<\/data>/g, data.keywords);
  var domParser = new DOMParser(); //문자열에서 DOM으로 HTML 소스코드를 구문분석 하는 기능을 제공

  var dom = domParser.parseFromString(html, "text/html"); //DOMParserHTML을 포함하는 문자열을 구문 분석하여 HTMLDocument를 반환

  var el = dom.querySelector(".tpl_html");
  return el;
}