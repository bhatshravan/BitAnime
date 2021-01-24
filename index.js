const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const app = express();
const path = require("path");
const Axios = require("axios");
const hooman = require("hooman");
const Cache = require("axios-cache-adapter");

const cache = Cache.setupCache({
  maxAge: 30 * 60 * 1000,
});

// Create `axios` instance passing the newly created `cache.adapter`
const api = Axios.create({
  adapter: cache.adapter,
});

//Use CORS
app.use(cors());
app.options("*", cors());

//BodyParser and logger with morgan
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.get("/episode/:mal/:vsrc", (req, res) => {
  //   let url = "https://animato.me/api2/getAnime/" + req.params.mal;
  let url = "https://animato.me/getAnimeMalID/" + req.params.mal;
  if (req.params.vsrc == 2) {
    url = " https://animato.me/api2/getAnime/" + req.params.mal;
  }
  console.log("🚀 ~ file: index.js ~ line 32 ~ app.get ~ url", url);
  api
    .get(url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log("file: index.js ~ line 38 ~ app.get ~ error", error);
      res.status(400).json({ success: false });
    });
});

app.get("/search/:mal", (req, res) => {
  let url = "https://api.jikan.moe/v3/search/anime?q=" + req.params.mal;
  console.log("🚀 ~ file: index.js ~ line 32 ~ app.get ~ url", url);
  api
    .get(url)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log("file: index.js ~ line 38 ~ app.get ~ error", error);
      res.status(400).json({ success: false });
    });
});

//Start server
app.listen(5001, function () {
  console.log("Started server at: http://localhost:5001 \n\n");
});
