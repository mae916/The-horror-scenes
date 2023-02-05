import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import sequelize from "../models";

import userRouter from "./router/userRouter"
import getMovie from "./get_movie";

const app = express();

const PORT = 4000;

app.use("/", express.static("src")); // 정적 경로 지정 어려움..
app.use("/", express.static("video")); //여기도  //html 파일에서 불러올때 경로가 src나, video 부터 써주면 안됨 그다음 경로부터 써줘야함
app.set("views", __dirname + "/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

dotenv.config();

app.get("/", async (req, res) => {
  
  // Kmdb API
    try {
    const data = await getMovie("","title","0");
    // console.log(data.list);

    return res.render("index.ejs", { list : data.list, title : "Home" });
  } catch (err) {
    console.error("실패", err);
  }
});

app.get("/get_movie", async (req, res) => {
  const { nation, sort, order } = req.query;
  const data = await getMovie(nation, sort, order);
  return res.send(data);
});

app.use("/user", userRouter);

const handleListening = () => {
  console.log(`http://localhost:${PORT}`);
};

app.listen(PORT, handleListening);


export default app;