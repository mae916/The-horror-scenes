"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var env = process.env.NODE_ENV || 'development';

var config = require("../config/config.json")[env];

var db = {};
var sequelize = new _sequelize["default"](config.database, config.username, config.password, config);
db.sequelize = sequelize;
var _default = db;
exports["default"] = _default;