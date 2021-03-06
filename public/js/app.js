let instance = axios.create({
  // baseURL: "https://animato.me",
  baseURL: "https://api2.bitstreak.in/",
  // baseURL: "http://localhost:5001/",
  timeout: 5000,
  headers: {},
});

if (!localStorage.bookmarks) {
  localStorage.setItem("bookmarks", JSON.stringify({ 1: false }));
}

let epCount = 0;
let epTitle = "";

async function runAxios(method, url, data) {
  console.log("Method", method);
  console.log("Data", data);

  let resp = await instance({
    method: method,
    url: url,
    data: data,
  })
    .then((response) => {
      console.log("🚀  ~ response", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("🚀 ~ Error:", error);
      if (error.response) {
        console.error(JSON.stringify(error.response));
      } else if (error.request) {
        console.error("error from client side");
      }
      return false;
    });
  return resp;
}

async function getEpisodes() {
  $("#alert").text("Loading ...").show();
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("mal");
  const vsrc = urlParams.get("vsrc");
  const airing = urlParams.get("airing");
  console.log("🚀 ~ file: app.js ~ line 42 ~ getEpisodes ~ airing", airing);

  console.log(`episode/${query}/${vsrc}/${airing}`);
  let response = await runAxios("get", `episode/${query}/${vsrc}/${airing}`, {});
  if (response.status == "success") {
    $("#alert").hide();
    let episodes = response.data.episodes;
    $("#title").text(response.data.Title);
    epTitle = response.data.Title;
    $("#bk").show();

    let bookmarks = JSON.parse(localStorage.bookmarks);
    if (bookmarks[query] !== undefined && bookmarks[query]) {
      $("#bk").removeClass().addClass("btn btn-success").text("Remove Bookmark");
    }

    console.log("🚀 ~ file: app.js ~ line 39 ~ getEpisodes ~ episodes", episodes);
    let i = 1;
    for (let key in episodes) {
      if (episodes.hasOwnProperty(key)) {
        let episode = episodes[key];
        let postString = "";
        postString += `<tr>
                            <td>${i}</td>
                            <td><p class="text-primary" style="cursor: pointer;" onclick="setEp('video.html?video=${
                              episode["slug"]
                            }&vsrc=${vsrc}',${i},${query})">${key.replace("_", " ")}</a></td>
                            <td id="v${i}"></td>
                        </tr>
                        `;

        $("#epList").append(postString);
        i = i + 1;
        epCount = i;
      }
    }

    if (localStorage.getItem(query)) {
      console.log(localStorage.getItem(query));
      try {
        document.getElementById(
          "v" + localStorage.getItem(query)
        ).innerHTML = `<button type="button" class="btn btn-success">Last Watched</button>`;
      } catch (err) {}
    }
  } else {
    $("#alert").text("Sorry, this show is not there").show();
  }
}

function setEp(url, episode, mal) {
  // console.log("🚀 ~ file: app.js ~ line 73 ~ setEp ~ episode", episode, mal);
  window.open(url);
  for (let i = 1; i < epCount; i++) {
    $(`#v${i}`).text("");
  }
  document.getElementById(
    "v" + episode
  ).innerHTML = `<button type="button" class="btn btn-primary">Watching</button>`;
  localStorage.setItem(mal, episode);
}

async function search() {
  $("#bm").hide();
  $("#alert").text("Loading ...").show();
  let query = $("#sanime").val();
  document.getElementById("amList").innerHTML = `<tr>
  <th>Sl. No</th>
  <th>Anime</th>
  <th>Alternate</th>
  <th>Score</th>
  <th>Episodes</th>
  <th>MAL Link</th>
</tr>`;
  console.log("🚀 ~ file: app.js ~ line 69 ~ search ~ query", query);
  if (query == "") {
    $("#alert").text("Please enter a query").show();
    return;
  }
  let resp = axios({
    method: "get",
    url: "https://api2.bitstreak.in/search/" + query,
    // url: "http://localhost:5001/search/" + query,
    data: {},
  })
    .then((response) => {
      console.log("🚀 ~ file: app.js ~ line 80 ~ .then ~ response", response.data);
      if (response.data.results !== undefined) {
        $("#amList").show();
        let results = response.data.results;
        let i = 0;

        results.forEach((element) => {
          console.log("🚀 ~ file: app.js ~ line 85 ~ results.forEach ~ element", element);
          i = i + 1;

          let postString = `<tr><td>${i}</td>
          <td><a href="episode.html?mal=${element.mal_id}&vsrc=1&airing=${
            element.airing ? "1" : "2"
          }">${element.title}</a></td>
          <td><a href="episode.html?mal=${element.mal_id}&vsrc=2&airing=${
            element.airing ? "1" : "2"
          }">Alternate</a></td>
          <td>${element.score}</td>
          <td>${element.airing ? "Airing" : element.episodes}</td>
          <td><a href="video.html/${element.slug}" target="_blank">Go</a></td></tr>`;
          $("#amList").append(postString);
        });

        $("#alert").text("Got results").show();
      } else {
        $("#alert").text("Could not get results").show();
      }
    })
    .catch((error) => {
      $("#alert").text("Error fetching data, check internet").show();
    });
}

function getVideo() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("video");
  const vsrc = urlParams.get("vsrc");

  let url = `https://animato.me/${vsrc == 1 ? "embed" : "embed2"}/?id=${query}`;

  console.log("🚀 ~ file: app.js ~ line 123 ~ getVideo ~ query", url);
  document.getElementById("content").innerHTML = `
  <iframe width="100%" height="100%" src="${url}" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true">
  </iframe>`;
}

function bookmark() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("mal");

  let bookmarks = JSON.parse(localStorage.bookmarks);
  if (bookmarks[query] !== undefined && bookmarks[query]) {
    removeBookmark();
  } else {
    addBookmark();
  }
}

function addBookmark() {
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("mal");
  const vsrc = urlParams.get("vsrc");
  const airing = urlParams.get("airing");

  let bookmarks = JSON.parse(localStorage.bookmarks);

  // bookmarks[query] = $("#title").text();
  bookmarks[query] = { title: epTitle, mal_id: query, vsrc: vsrc, airing: airing };
  $("#bk").removeClass().addClass("btn btn-success").text("Remove Bookmark");
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

function removeBookmark() {
  let bookmarks = JSON.parse(localStorage.bookmarks);
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get("mal");

  bookmarks[query] = false;
  $("#bk").removeClass().addClass("btn btn-warning").text("Add Bookmark");
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
