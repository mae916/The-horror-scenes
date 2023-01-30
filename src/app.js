import express from "express";
import dotenv from "dotenv";
import getMovie from "./get_movie";

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
  let count;
  
  // Kmdb API
 
    try {
    const data = await getMovie("미국");
    console.log(data.list);

    return res.render("index.ejs", data);
  } catch (err) {
    console.error("실패", err);
  }
});

app.get("/get_movie", async (req, res) => {
  const { nation } = req.query;
  const data = await getMovie(nation);
  return res.json(data);
});

const handleListening = () => {
  console.log(`http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);


