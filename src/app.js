import express from "express";
import dotenv from "dotenv";
import axios from "axios";

const app = express();

const PORT = 4000;

app.use("/", express.static("src")); // 정적 경로 지정 어려움..
app.use("/", express.static("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음 경로부터 써줘야함
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

dotenv.config();

// 박스오피스 API

app.get("/", async (req, res) => {
  let boxOList = [];
  let naverList = [];
  let resultList = [];

  let today = new Date();
  let year = String(today.getFullYear()); // 년도
  let month = 0 + String(today.getMonth() + 1); // 월
  let date = String(today.getDate() - 1); // 날짜(하루전)
  let day = year + month + date;

  await axios({
    method: "get",
    url: "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json",
    params: {
      key: process.env.BOXOFFICE_KEY,
      targetDt: day,
    },
  })
    .then(function (response) {
      boxOList = response.data.boxOfficeResult.dailyBoxOfficeList;
    })
    .catch(function (error) {
      console.log("실패", error);
    });

  // 네이버 영화 검색 API
  for (let i = 0; i < boxOList.length; i++) {
    // let foundMatch = `/^${boxOList[i].movieNm}$/`.test(boxOList[i].movieNm);
    await axios({
      method: "get",
      url: "https://openapi.naver.com/v1/search/movie.json",
      params: {
        query: boxOList[i].movieNm,
        // query: boxOList[i].movieNm,
      },
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_ID,
        "X-Naver-Client-Secret": process.env.NAVER_SECRET,
      },
    })
      .then(function (response) {
        const reg = /<[^>]*>?/g;
        naverList[i] = response.data.items[0];
        // console.log(naverList);
        naverList[i] = response.data.items[0];
        naverList[i].title = response.data.items[0].title.replace(reg, "");
        naverList[i].director = response.data.items[0].director.replace(
          "|",
          ""
        );
        naverList[i].rank = boxOList[i].rank;

        // console.log(boxOList);
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
      })
      .catch(function (error) {
        console.log("실패", error);
      });
  }
  // console.log(boxOList);
  console.log(naverList);
  return res.render("index.ejs", { naverList });
});

// app.get("/login", (req, res) => {
//   res.send("LOGIN");
// });

const handleListening = () => {
  console.log(`http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
