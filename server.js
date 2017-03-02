"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const API_KEY     = process.env.GOOGLE_API;
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const db = require("./tmp/in-memory-db-markers");
const DataHelpers = require("./data-helpers.js")(db);
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./tmp/maps")(DataHelpers);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");

//Define request-local variables
app.use(function(req, res, next){
  res.locals.apiQuery = '';
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));
app.use("/maps", mapsRoutes);

//Test routes
app.get("/", (req, res) => {
  res.locals.apiQuery = "&callback=initMap";
  res.render("test");
});

//Make the Google API key available to templates
app.locals = {
  gMapsApiKey: API_KEY
};


//
// app.get("/maps", (req, res) => {
//   res.render("maps_index");
// });
//
// app.get("/maps/map", (req, res) => {
//   res.locals.apiQuery = "&callback=initMap";
//   res.render("maps_show");
// });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
