"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _callee = function _callee(nation) {
  var response, list, count, nationEn, i, arr, j;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp",
            params: {
              collection: "kmdb_new2",
              ServiceKey: process.env.KMDB_KEY,
              genre: "공포",
              detail: "Y",
              sort: "prodYear,1",
              listCount: 30,
              nation: nation //click event(filter)

            }
          }));

        case 2:
          response = _context.sent;
          list = response.data.Data[0].Result;
          count = response.data.Data[0].TotalCount;

          if (!(nation == "")) {
            _context.next = 9;
            break;
          }

          nationEn = "everything";
          _context.next = 23;
          break;

        case 9:
          _context.t0 = nation;
          _context.next = _context.t0 === "대한민국" ? 12 : _context.t0 === "미국" ? 14 : _context.t0 === "영국" ? 16 : _context.t0 === "일본" ? 18 : _context.t0 === "중국" ? 20 : 22;
          break;

        case 12:
          nationEn = "Korea";
          return _context.abrupt("break", 23);

        case 14:
          nationEn = "USA";
          return _context.abrupt("break", 23);

        case 16:
          nationEn = "UK";
          return _context.abrupt("break", 23);

        case 18:
          nationEn = "Japan";
          return _context.abrupt("break", 23);

        case 20:
          nationEn = "China";
          return _context.abrupt("break", 23);

        case 22:
          nationEn = "everything";

        case 23:
          //API에서 가져온 db 가공 후 list에 넣기
          for (i = 0; i < list.length; i++) {
            list[i].plot = list[i].plots.plot[0].plotText; // 줄거리

            list[i].director = list[i].directors.director[0].directorNm;

            if (list[i].keywords) {
              list[i].keywords = "#" + list[i].keywords.replaceAll(",", " #");
            }

            list[i].poster = list[i].posters.replace("thm/02", "poster").replace("tn_", "").replace(".jpg", "_01.jpg");

            if (list[i].repRlsDate !== "") {
              list[i].repRlsDate = "(" + list[i].repRlsDate.substring(0, 4) + ")";
            }

            arr = list[i].posters.split("|");
            list[i].poster = arr[0];
          } // 이미지가 없는 경우 삭제


          for (j = 0; j < list.length; j++) {
            if (list[j].posters === "") {
              list.splice(j, 1);
              j--;
            }
          }

          return _context.abrupt("return", {
            list: list,
            count: count,
            nationEn: nationEn
          });

        case 26:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports["default"] = _callee;