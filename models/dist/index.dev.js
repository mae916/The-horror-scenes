"use strict";

var _sequelize = require("sequelize");

var env = process.env.NODE_ENV || "development";

var config = require("../config/config.json")[env];

var db = {};
var sequelize = new _sequelize.Sequelize(config.database, config.username, config.password, config);
db.Sequelize = _sequelize.Sequelize;
db.sequelize = sequelize;
sequelize.sync({
  force: false
}).then(function () {
  console.log("데이터베이스 연결됨.");
})["catch"](function (err) {
  console.error(err);
});
module.exports = db;