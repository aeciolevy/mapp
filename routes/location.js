"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  //Show Location Data
  router.get('/', (req, res) => {
    let getLocations = knex('locations')
    .select('*');
    getLocations.then(data => {
      res.json(data);
    });
  });

  router.get('/:id', (req, res) => {
    let getOneLocation = knex('locations')
    .select('*')
    .where({
      map_id: req.params.id
    });
    getOneLocation.then(data => {
      res.json(data);
    });
  });

  //Insert Location Data
  router.post('/:id', (req, res) => {
    knex('locations')
    .insert({
      title: req.body.title,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      map_id: req.params.id,
      user_id: req.session.user_id })
      .then((rows) => {
        console.log(rows);
      });
    // knex.insert({
    //   title: req.body.title,
    //   description: req.body.description,
    //   latitude: req.body.latitude,
    //   longitude: req.body.longitude,
    //   map_id: req.params.id,
    //   user_id: req.session.user_id
    // }).into('locations').
  });

  //Delete Location
  // router.post('/:id/delete', (req, res) => {
  // });

  return router;
};
