"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {

  // GET METHODS

  const mapsLists = [
    {name: "My Mapps", query: "user"},
    {name: "Favorites", query: "favs"},
    {name: "Contributed", query: "contrib"},
    {name: "All", query: "all"}
  ];
  //GEt METHOD FOR /MAPS
  router.get('/', (req, res) => {
    let currentList = 'All';
    let perPage = 12;
    let selectMaps = knex
      .select('*')
      .from('maps');
    //Query for user maps
    if (req.query.show === 'user') {
      currentList = 'My Mapps';
      selectMaps = knex
      .select('*')
      .from('maps')
      .where({
        user_id: req.session.user_id
      });
    }
    //Query for user favorite maps
    if (req.query.show === 'favs') {
      selectMaps = knex('favorites')
      .select('maps.id', 'maps.title')
      .join('maps', {'favorites.map_id': 'maps.id'})
      .where({
        'favorites.user_id': req.session.user_id
      });
      currentList = 'Favorites';
    }
    //Query for maps who user contributed for
    if (req.query.show === 'contrib') {
      selectMaps = knex('maps')
      .distinct('maps.id', 'maps.title', 'maps.user_id')
      .join('locations', {'locations.map_id': 'maps.id'})
      .where({
        'locations.user_id': req.session.user_id
      });
      currentList = 'Contributed';
    }
    //Promisse
    selectMaps.then(maps => {
      if (req.session.user_id) {
        res.render('./maps/index', {
          maps: maps,
          mapsLists: mapsLists,
          currentList: currentList
        });
      } else {
        res.render('./maps/public', {
          maps: maps
        });
      }
    });
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
  router.post("/map_id/location", (req, res) => {
    console.log('BODYY:::', req.body);

    if (!req.body.locationTitle) {
      res.status(400).json({
        error: 'invalid request: no data in POST body'
      });
      return;
    }
  });

  router.get("/:map_id", (req, res) => {
    res.locals.apiQuery = "&callback=initMap&libraries=places";
    res.render("maps_show");
  });

  return router;
};
