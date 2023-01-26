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

app.get("/", async (req, res) => {
  let list = [];

  // Kmdb API
  await axios({
    method: "get",
    url: "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp",
    params: {
      collection: "kmdb_new2",
      ServiceKey: process.env.KMDB_KEY,
      genre: "공포",
      detail: "Y",
      sort: "prodYear,1",
      listCount: 30,
    },
  })
    .then(function (response) {
      list = response.data.Data[0].Result;
    })
    .catch(function (error) {
      console.log("실패", error);
    });

  //API에서 가져온 db 가공 후 list에 넣기
  for (let i = 0; i < list.length; i++) {
    list[i].plot = list[i].plots.plot[0].plotText; // 줄거리
    list[i].director = list[i].directors.director[0].directorNm;
    list[i].poster = list[i].posters
      .replace("thm/02", "poster")
      .replace("tn_", "")
      .replace(".jpg", "_01.jpg");

    if (list[i].repRlsDate !== "") {
      list[i].repRlsDate = "(" + list[i].repRlsDate.substring(0, 4) + ")";
    }

    const arr = list[i].posters.split("|");
    list[i].poster = arr[0];
  }

  // 이미지가 없는 경우 삭제
  for (var j = 0; j < list.length; j++) {
    if (list[j].posters === "") {
      list.splice(j, 1);
      j--;
    }
  }

  return res.render("index.ejs", { list });
});

const handleListening = () => {
  console.log(`http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);
