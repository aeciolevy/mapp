"use strict";

const express = require('express');
const router  = express.Router();


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
    } else {
      knex.select("id")
          .from("users")
          .where('id', req.params.user_id)
          .then((results) => {
            if (results.length) {
              req.session.user_id = results[0].id;
              res.redirect("/maps");
            } else {
              res.status(401).send("No user of that ID");
            }
          });
    }
  });

  return router;
};
