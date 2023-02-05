"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postJoin = exports.getJoin = void 0;

var getJoin = function getJoin(req, res) {
  return res.render("join.ejs", {
    title: "Join"
  });
};

exports.getJoin = getJoin;

var postJoin = function postJoin(req, res) {
  console.log(req.body);
  return res.redirect("/");
};

exports.postJoin = postJoin;