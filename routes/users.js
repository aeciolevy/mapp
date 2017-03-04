"use strict";

const express = require('express');
const router  = express.Router();

const thumbnail = require("../lib/thumbnail.js");

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
      });
  });

  router.get("/:user_id/login", (req, res) => {
    if (req.params.user_id === "0") {
      req.session = null;
      res.redirect("/maps");
    } else {
      knex.select("*")
          .from("users")
          .where('id', req.params.user_id)
          .then((results) => {
            if (results.length) {
              req.session.user_id = results[0].id;
              req.session.user_name = results[0].name;
              res.redirect("/maps");
            } else {
              res.status(401).send("No user of that ID");
            }
          });
    }
  });

  router.get("/:user_id", (req, res) => {
    let favMaps = knex('favorites')
    .select('maps.id', 'maps.title')
    .join('maps', {'favorites.map_id': 'maps.id'})
    .where({
      'favorites.user_id': req.params.user_id
    }).then(maps => Promise.all(maps.map(thumbnail.createUrl)));
    let contribMaps = knex('maps')
    .distinct('maps.id', 'maps.title', 'maps.user_id')
    .join('locations', {'locations.map_id': 'maps.id'})
    .where({
      'locations.user_id': req.params.user_id
    }).then(maps => Promise.all(maps.map(thumbnail.createUrl)));
    Promise.all([favMaps, contribMaps]).then(mapSets => {
      knex
        .select("*")
        .from("users")
        .where('id', req.params.user_id)
        .then((user) => {
          res.render("./users/profile", {user: user[0], favMaps: mapSets[0], contribMaps: mapSets[1]});
          // console.log(mapSets[0], mapSets[1], user[0]);
        });
    });
  });

  return router;
};
