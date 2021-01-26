const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var morgan = require("morgan");
const app = express();
const path = require("path");
const Axios = require("axios");
const fs = require("fs");
const hooman = require("hooman");
const Cache = require("axios-cache-adapter");

const cache = Cache.setupCache({
  maxAge: 30 * 60 * 1000,
});

const cache2 = Cache.setupCache({
  maxAge: 30 * 24 * 60 * 60 * 1000,
});

const cache3 = Cache.setupCache({
  maxAge: 3 * 24 * 60 * 60 * 1000,
});

// Create `axios` instance passing the newly created `cache.adapter`
const api = Axios.create({
  adapter: cache.adapter,
});

const api2 = Axios.create({
  adapter: cache2.adapter,
});

const api3 = Axios.create({
  adapter: cache3.adapter,
});

//Use CORS
app.use(cors());
app.options("*", cors());

//BodyParser and logger with morgan
var accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

// setup the logger
app.use(morgan("combined", { stream: accessLogStream }));
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

app.get("/episode/:mal/:vsrc/:airing", (req, res) => {
  //   let url = "https://animato.me/api2/getAnime/" + req.params.mal;
  let url = "https://animato.me/getAnimeMalID/" + req.params.mal;
  if (req.params.vsrc == 2) {
    url = " https://animato.me/api2/getAnime/" + req.params.mal;
  }
  console.log("🚀 ~ file: index.js ~ line 32 ~ app.get ~ url", url);

  console.log("🚀 ~ file: index.js ~ line 71 ~ app.get ~ req.params", req.params);
  let apis = api2;
  if (req.params.airing === 1) {
    apis = api;
  }
  apis
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
  api3
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
