"use strict";

app.set("port", process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

require("./models/index");

app.get("/", function (req, res) {
  res.json({
    message: "hello world"
  });
});
app.listen(app.get("port"), function () {
  console.log(app.get("port"), "번 포트에서 대기 중");
});