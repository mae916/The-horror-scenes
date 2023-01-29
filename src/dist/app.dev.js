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

_dotenv["default"].config();

app.get("/", function _callee(req, res) {
  var list, count, i, arr, j;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          list = [];
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: "get",
            url: "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp",
            params: {
              collection: "kmdb_new2",
              ServiceKey: process.env.KMDB_KEY,
              genre: "공포",
              detail: "Y",
              sort: "prodYear,1",
              createDts: "2000",
              //click event(sort)
              listCount: 2,
              nation: "미국" //click event(filter)

            }
          }).then(function (response) {
            list = response.data.Data[0].Result;
            count = response.data.Data[0].TotalCount;
          })["catch"](function (error) {
            console.log("실패", error);
          }));

        case 3:
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
          } // };


          return _context.abrupt("return", res.render("index.ejs", {
            list: list,
            count: count
          }));

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
});

var handleListening = function handleListening() {
  console.log("http://localhost:".concat(PORT));
};

app.listen(PORT, handleListening);