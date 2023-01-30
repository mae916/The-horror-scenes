import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export default async (nation) => {
    nation = nation || "미국";

    const response = await axios({
      method: "get",
      url: "http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp",
      params: {
        collection: "kmdb_new2",
        ServiceKey: process.env.KMDB_KEY,
        genre: "공포",
        detail: "Y",
        sort: "prodYear,1",
        listCount: 2,
        nation, //click event(filter)
      },
    });
    

    const list = response.data.Data[0].Result;
    const count = response.data.Data[0].TotalCount;

    let nationEn;
    if (nation == "") {
        nationEn = "everything";
    } else {
        switch(nation) {
            case "대한민국":
                nationEn = "Korea";
                break;
            case "미국":
                nationEn = "USA";
                break;
            case "영국":
                nationEn = "UK";
                break;
            case "일본":
                nationEn = "Japan";
                break;
            case "중국":
                nationEn = "China";
                break;
            default:
                nationEn = "everything";
        }
    }

    //API에서 가져온 db 가공 후 list에 넣기
    for (let i = 0; i < list.length; i++) {
      list[i].plot = list[i].plots.plot[0].plotText; // 줄거리
      list[i].director = list[i].directors.director[0].directorNm;
      if (list[i].keywords) {
        list[i].keywords = "#" + list[i].keywords.replaceAll(",", " #");
      }
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

    return {list, count, nationEn};
};