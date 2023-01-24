"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 4000;
app.use("/", _express["default"]["static"]("src")); // 정적 경로 지정 어려움..

app.use("/", _express["default"]["static"]("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음부터 써줘야함

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

_dotenv["default"].config(); // 박스오피스 API


app.get("/", function _callee(req, res) {
  var list, _loop, i;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          list = [];
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
            params: {
              key: process.env.BOXOFFICE_KEY,
              targetDt: 20230122
            }
          }).then(function (response) {
            var boxOList = response.data.boxOfficeResult.weeklyBoxOfficeList;
            list = boxOList;
          })["catch"](function (error) {
            console.log("실패", error);
          }));

        case 3:
          _loop = function _loop(i) {
            // 네이버 영화 검색 API
            // let foundMatch = `/^${list[i].movieNm}$/`.test(list[i].movieNm);
            (0, _axios["default"])({
              method: "get",
              url: "https://openapi.naver.com/v1/search/movie.json",
              params: {
                query: list[i].movieNm
              },
              headers: {
                "X-Naver-Client-Id": process.env.NAVER_ID,
                "X-Naver-Client-Secret": process.env.NAVER_SECRET
              }
            }).then(function (response) {
              if (response.data.items[0].title == list[i].movieNm) {}
            })["catch"](function (error) {
              console.log("실패", error);
            });
          };

          for (i = 0; i < list.length; i++) {
            _loop(i);
          }

          return _context.abrupt("return", res.render("index.ejs", {
            list: list
          }));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}); // app.get("/login", (req, res) => {
//   res.send("LOGIN");
// });

var handleListening = function handleListening() {
  console.log("http://localhost:".concat(PORT));
};

app.listen(PORT, handleListening);