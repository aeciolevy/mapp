"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // GET METHODS

  //Show All Maps
  router.get("/", (req, res) => {
    res.render("maps_index");
  });
  //Show one particular Map
  router.get("/id/:map_id", (req, res) => {
    console.log("id:", req.params.map_id);
    if (req.params.map_id === '1' || req.params.map_id === '2' || req.params.map_id === '3'){
      res.json(knex);
    } else {
      res.status(401).send("Wrong Id");
    }
  });
  //Show favorite Maps
  router.get("/favorite", (req, res) => {
    res.send("Favorite Maps");
  });
  //Show Contributed Maps
  router.get("/contributed", (req, res) => {
    res.send("Contributed Maps");
  });

  //POST METHODS
  //POST were not tested yet.
  //Favorite a Map
  router.post("/:map_id/favorite", (req, res) => {
    res.status(201).send("map favourited");
  });
  //Add a Map
  router.post("/", (req, res) => {
    // res.render("maps_index");
  });
  //Delete a Map
  router.post("/delete", (req, res) => {
    // res.render("maps_index");
  });
  //Add Location
  router.post("/:map_id/location", (req, res) => {
    // res.render("maps_index");
  });


  //Temporary to test the map
  router.get("/map", (req, res) => {
    res.locals.apiQuery = "&callback=initMap";
    res.render("maps_show");
  });

  return router;
};
