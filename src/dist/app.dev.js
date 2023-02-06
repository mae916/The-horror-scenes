"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _morgan = _interopRequireDefault(require("morgan"));

var _models = _interopRequireDefault(require("./models"));

var _userRouter = _interopRequireDefault(require("./router/userRouter"));

var _get_movie = _interopRequireDefault(require("./get_movie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
var PORT = 4000;
app.use("/", _express["default"]["static"]("src")); // 정적 경로 지정 어려움..

app.use("/", _express["default"]["static"]("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음 경로부터 써줘야함

app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use((0, _morgan["default"])('dev'));
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));

_dotenv["default"].config();

app.get("/", function _callee(req, res) {
  var data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap((0, _get_movie["default"])("", "title", "0"));

        case 3:
          data = _context.sent;
          return _context.abrupt("return", res.render("index.ejs", {
            list: data.list,
            title: "Home"
          }));

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error("실패", _context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
app.get("/get_movie", function _callee2(req, res) {
  var _req$query, nation, sort, order, data;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$query = req.query, nation = _req$query.nation, sort = _req$query.sort, order = _req$query.order;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _get_movie["default"])(nation, sort, order));

        case 3:
          data = _context2.sent;
          return _context2.abrupt("return", res.send(data));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.use("/user", _userRouter["default"]);

var handleListening = function handleListening() {
  console.log("http://localhost:".concat(PORT));
};

app.listen(PORT, handleListening);
var _default = app;
exports["default"] = _default;