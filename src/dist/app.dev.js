"use strict";

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 4000;
app.use("/", _express["default"]["static"]("src")); // 정적 경로 지정 어려움..

app.use("/", _express["default"]["static"]("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음 경로부터 써줘야함

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

_dotenv["default"].config(); // 박스오피스 API


app.get("/", function _callee(req, res) {
  var boxOList, naverList, resultList, today, year, month, date, day, _loop, i;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          boxOList = [];
          naverList = [];
          resultList = [];
          today = new Date();
          year = String(today.getFullYear()); // 년도

          month = 0 + String(today.getMonth() + 1); // 월

          date = String(today.getDate() - 1); // 날짜(하루전)

          day = year + month + date;
          _context2.next = 10;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
            params: {
              key: process.env.BOXOFFICE_KEY,
              targetDt: day
            }
          }).then(function (response) {
            boxOList = response.data.boxOfficeResult.dailyBoxOfficeList;
          })["catch"](function (error) {
            console.log("실패", error);
          }));

        case 10:
          _loop = function _loop(i) {
            return regeneratorRuntime.async(function _loop$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return regeneratorRuntime.awrap((0, _axios["default"])({
                      method: "get",
                      url: "https://openapi.naver.com/v1/search/movie.json",
                      params: {
                        query: boxOList[i].movieNm // query: boxOList[i].movieNm,

                      },
                      headers: {
                        "X-Naver-Client-Id": process.env.NAVER_ID,
                        "X-Naver-Client-Secret": process.env.NAVER_SECRET
                      }
                    }).then(function (response) {
                      var reg = /<[^>]*>?/g;
                      naverList[i] = response.data.items[0]; // console.log(naverList);

                      naverList[i] = response.data.items[0];
                      naverList[i].title = response.data.items[0].title.replace(reg, "");
                      naverList[i].director = response.data.items[0].director.replace("|", "");
                      naverList[i].rank = boxOList[i].rank; // console.log(boxOList);
                      // console.log(naverList);
                      // for (let j = 0; j < naverList.lenth; j++) {
                      //   naverList[j] = String.replace(reg, naverList[j].title);
                      //   if (naverList[j].title == boxOList[i].movieNm) {
                      //     resultList[j].title = naverList[j].title;
                      //     resultList[j].image = naverList[j].image;
                      //     resultList[j].director = naverList[j].director;
                      //     resultList[j].userRating = naverList[j].userRating;
                      //   } else {
                      //     continue;
                      //   }
                      // }
                    })["catch"](function (error) {
                      console.log("실패", error);
                    }));

                  case 2:
                  case "end":
                    return _context.stop();
                }
              }
            });
          };

          i = 0;

        case 12:
          if (!(i < boxOList.length)) {
            _context2.next = 18;
            break;
          }

          _context2.next = 15;
          return regeneratorRuntime.awrap(_loop(i));

        case 15:
          i++;
          _context2.next = 12;
          break;

        case 18:
          // console.log(boxOList);
          console.log(naverList);
          return _context2.abrupt("return", res.render("index.ejs", {
            naverList: naverList
          }));

        case 20:
        case "end":
          return _context2.stop();
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