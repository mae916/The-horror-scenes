"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _dotenv = _interopRequireDefault(require("dotenv"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _callee = function _callee(nation, sort, order) {
  var response, list, count, nationEn, orderNm, i, arr, j;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          ;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp",
            params: {
              collection: "kmdb_new2",
              ServiceKey: process.env.KMDB_KEY,
              genre: "공포",
              detail: "Y",
              sort: "".concat(sort, ",").concat(order),
              //1 내림차순 0 오름차순
              listCount: 30,
              nation: nation //click event(filter)

            }
          }));

        case 3:
          response = _context.sent;
          list = response.data.Data[0].Result;
          count = response.data.Data[0].TotalCount;

          if (!(nation == "")) {
            _context.next = 10;
            break;
          }

          nationEn = "everything";
          _context.next = 24;
          break;

        case 10:
          _context.t0 = nation;
          _context.next = _context.t0 === "대한민국" ? 13 : _context.t0 === "미국" ? 15 : _context.t0 === "영국" ? 17 : _context.t0 === "일본" ? 19 : _context.t0 === "중국" ? 21 : 23;
          break;

        case 13:
          nationEn = "Korea";
          return _context.abrupt("break", 24);

        case 15:
          nationEn = "USA";
          return _context.abrupt("break", 24);

        case 17:
          nationEn = "UK";
          return _context.abrupt("break", 24);

        case 19:
          nationEn = "Japan";
          return _context.abrupt("break", 24);

        case 21:
          nationEn = "China";
          return _context.abrupt("break", 24);

        case 23:
          nationEn = "everything";

        case 24:
          if (order == "1") {
            orderNm = "descending";
          } else if (order == "0") {
            orderNm = "ascending";
          } else {
            orderNm = "descending";
          } //API에서 가져온 db 가공 후 list에 넣기


          for (i = 0; i < list.length; i++) {
            list[i].plot = list[i].plots.plot[0].plotText; // 줄거리

            list[i].director = list[i].directors.director[0].directorNm;

            if (list[i].keywords) {
              list[i].keywords = "#" + list[i].keywords.replace(/ /g, '').replaceAll(",", " #");
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
            nationEn: nationEn,
            sort: sort,
            orderNm: orderNm
          });

        case 28:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports["default"] = _callee;