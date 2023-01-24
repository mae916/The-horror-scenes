import express from "express";
import dotenv from "dotenv";
import axios from "axios";

const app = express();

const PORT = 4000;

app.use("/", express.static("src")); // 정적 경로 지정 어려움..
app.use("/", express.static("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음부터 써줘야함
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

dotenv.config();

// 박스오피스 API

app.get("/", async (req, res) => {
  let list = [];

  await axios({
    method: "get",
    url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchWeeklyBoxOfficeList.json",
    params: {
      key: process.env.BOXOFFICE_KEY,
      targetDt: 20230122,
    },
  })
    .then(function (response) {
      const boxOList = response.data.boxOfficeResult.weeklyBoxOfficeList;
      list = boxOList;
    })
    .catch(function (error) {
      console.log("실패", error);
    });

  for (let i = 0; i < list.length; i++) {
    // 네이버 영화 검색 API
    // let foundMatch = `/^${list[i].movieNm}$/`.test(list[i].movieNm);
    axios({
      method: "get",
      url: "https://openapi.naver.com/v1/search/movie.json",
      params: {
        query: list[i].movieNm,
      },
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_ID,
        "X-Naver-Client-Secret": process.env.NAVER_SECRET,
      },
    })
      .then(function (response) {
        if (response.data.items[0].title == list[i].movieNm) {
        }
      })
      .catch(function (error) {
        console.log("실패", error);
      });
  }
  return res.render("index.ejs", { list });
});

// app.get("/login", (req, res) => {
//   res.send("LOGIN");
// });

const handleListening = () => {
  console.log(`http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
