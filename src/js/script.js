//레이어 팝업 on인 경우 body 스크롤 막기
const body = document.getElementsByTagName("body")[0];

$(function () {
  $("#filter").click(function () {
    $("#filterMenu").show();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.add("scrollLock");
  });
  $("#sort").click(function () {
    $("#sortMenu").show();
    $("#filterMenu").hide();
    $("#orderMenu").hide();
    body.classList.add("scrollLock");
  });
  $("#order").click(function () {
    $("#orderMenu").show();
    $("#filterMenu").hide();
    $("#sortMenu").hide();
    body.classList.add("scrollLock");
  });
  $(".xi-close").click(function () {
    $("#filterMenu").hide();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.remove("scrollLock");
  });

  $(".category").click(function(e) {
    let nation = $(this).data("nation");
    let sort = $(this).data("sort");
    let order = $(this).data("order");

    //선택한 카테고리를 세션에 저장함
    if(nation === undefined) {
      if (sessionStorage.nation === undefined) {
        nation = "";
      } else {
        nation = sessionStorage.nation;
      }
    }

    if(sort === undefined) {
      if (sessionStorage.sort === undefined) {
        sort = "prodYear";
      } else {
        sort = sessionStorage.sort;
      }
    }

    if(order === undefined) {
      if (sessionStorage.order === undefined) {
        order = "1";
      } else {
        order = sessionStorage.order;
      }
    }

    sessionStorage.setItem("nation", nation);
    sessionStorage.setItem("sort", sort);
    sessionStorage.setItem("order", order);

    let sNation = sessionStorage.getItem("nation");
    let sSort = sessionStorage.getItem("sort");
    let sOrder = sessionStorage.getItem("order");

    const cateArr = { nation : sNation , sort : sSort, order : sOrder };

    process(cateArr);

    //새로고침시 이전 세션에 저장한 카테고리 내역 삭제
    $(window).bind("beforeunload", function () {
      sessionStorage.clear();
    });
      
    async function process(cateArr) {
      try {
        
        const data = await ajaxLoad('/get_movie', { cateArr }); // ajaxLoad내에 프라미스에서 반환된 resolve(data)

        const list = data.list;
        const el = document.querySelector(".movie_info");
        if (!el) {
          throw new Error("movie_info 요소 없음.");
        }      
        let no = 1;
        el.innerHTML = "";
        for (const li of list) {
          const childEl = getContentDOM(li, no);
          el.appendChild(childEl);
          no++;

        }

        // navigation 이름 바꿔주기
        const filter = document.getElementById("filter");
        const sortFilter = document.getElementById("sort");
        const orderFilter = document.getElementById("order");
        filter.innerHTML = data.nationEn;
        sortFilter.innerHTML = data.sort;
        orderFilter.innerHTML = data.orderNm;
        
      } catch (err) {
        console.error(err);
      }
      
    }

    $("#filterMenu").hide();
    $("#sortMenu").hide();
    $("#orderMenu").hide();
    body.classList.remove("scrollLock");
    $(window).scrollTop(0);
  });
});

function ajaxLoad(url, data) {
  return new Promise((resolve, reject) => {
    //resolve(value) : 일이 성공적으로 끝난 경우 그 결과를 나타내는 value와 함께 호출
    //reject(error) : 에러 발생 시 에러 객체를 나타내는 error와 함께 호출
    // 이 안에 코드(제작코드)가 준비 되면 new Promise는 다른 함수(ajaxLoad, 소비코드)에서 사용할 수 있도록 도와줌
    const xhr = new XMLHttpRequest(); //XMLHttpRequest 객체 생성
    const params = new URLSearchParams(); //URL의 파라미터 값을 확인
    
    if (data) {
      for(const key in data) {
        let cate = data[key];
        
        for(const index in cate) {
          params.append(index, cate[index]);//append(추가할 매개변수의 이름, 추가할 매개변수의 값) : 지정한 키/값 쌍을 새로운 검색 매개변수로서 추가
        
        }
      }
      if (url.indexOf("?") == -1) { //?가 없으면 추가
        url += "?";
      } 

      url += params.toString(); //URL에서 사용하기에 적합한 쿼리 문자열을 반환
    }

    // const fullUrl = new URL(`http://localhost:4000${url}`);
    // const Pnation = fullUrl.searchParams.get('nation');
  
    
    
    xhr.open("GET", url); // http 요청 초기화
    xhr.send(null); // http 요청 전송

    xhr.onreadystatechange = () => { // readystate 프로퍼티 값이 변경된 경우
      if (xhr.status == 200 && xhr.readyState == XMLHttpRequest.DONE) {
        const data = JSON.parse(xhr.responseText);// 서버가 전송한 http 요청에 대한 응답 문자열(responseText)을 객체로 변환
        resolve(data); //성공적으로 끝났다는 신호가 전달되면서 result는 data 값이 됨.
      }
    }

    xhr.onerror = (err) => {
      reject(err);// 에러와 함께 실행이 종료되었다는 신호를 보냄.
    };
  });
}

function getContentDOM(data, no) {
  const tpl = document.getElementById("tpl");
  if (!tpl) return;
  
    let html = tpl.innerHTML;
    html = html.replace(/<data>movieName<\/data><data>repRlsDate<\/data>/g, `${data.title} ${data.repRlsDate}`)
              .replace(/<data>director<\/data>/g, data.director)
              .replace(/<data>no<\/data>/g, no)
              .replace(/<data>poster<\/data>/g, data.poster)
              .replace(/<data>plot<\/data>/g, data.plot)
              .replace(/<data>keywords<\/data>/g, data.keywords);
  const domParser = new DOMParser(); //문자열에서 DOM으로 HTML 소스코드를 구문분석 하는 기능을 제공
  const dom = domParser.parseFromString(html, "text/html"); //DOMParserHTML을 포함하는 문자열을 구문 분석하여 HTMLDocument를 반환
  const el = dom.querySelector(".tpl_html");
  return el;
}



