let instance = axios.create({
  // baseURL: "https://animato.me",
  baseURL: "http://localhost:5001",
  timeout: 5000,
  headers: {},
});

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

  let response = await runAxios("get", `episode/${query}`, {});
  if (response.status == "success") {
    $("#alert").hide();
    let episodes = response.data.episodes;
    $("#title").text(response.data.Title);
    console.log("🚀 ~ file: app.js ~ line 39 ~ getEpisodes ~ episodes", episodes);
    let i = 1;
    for (let key in episodes) {
      if (episodes.hasOwnProperty(key)) {
        let episode = episodes[key];
        let postString = "";
        postString += `<tr>
                            <td>${i}</td>
                            <td><a href="${episode["embedlink"]}" target="_blank">${key.replace(
          "_",
          " "
        )}</a></td>
                        </tr>
                        `;

        $("#epList").append(postString);
        i = i + 1;
      }
    }
  } else {
    $("#alert").text("Error fetching data, check internet").show();
  }
}

async function search() {
  $("#alert").text("Loading ...").show();
  let query = $("#sanime").val();
  document.getElementById("amList").innerHTML = `<tr>
  <th>Sl. No</th>
  <th>Anime</th>
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
    url: "http://localhost:5001/search/" + query,
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
          <td><a href="episode.html?mal=${element.mal_id}" target="_blank">${element.title}</a></td>
          <td>${element.score}</td>
          <td>${element.airing ? "Airing" : element.episodes}</td>
          <td><a href="${element.url}" target="_blank">Go</a></td></tr>`;
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
