"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const API_KEY     = process.env.GOOGLE_API;
const express     = require("express");
const bodyParser  = require("body-parser");
const cookieSession = require("cookie-session");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const locationRoutes = require("./routes/location");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'mapp']
}));

//Make the Google API key available to templates
// app.locals = {
//   gMapsApiKey: API_KEY
// };

//Define request-local variables
app.use(function(req, res, next){
  res.locals.apiQuery = '';
  res.locals.gMapsApiKey = API_KEY;
  res.locals.user_id = req.session.user_id;
  res.locals.user_name = req.session.user_name;
  next();
});

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
const initialDb = require("./db/initialDb");

// Mount all resource routes
app.use("/users", usersRoutes(knex));
app.use("/maps", mapsRoutes(knex));
app.use("/locations", locationRoutes(knex));


//Test routes
app.get("/", (req, res) => {
  res.render("index");
});


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
