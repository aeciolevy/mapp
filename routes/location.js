"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  //Show Location Data
  router.get('/', (req, res) => {
    let getLocations = knex('locations')
      .select('*');
    if (req.query.show === 'maps') {
      getLocations = knex('locations')
        .select('*')
        .where({
          map_id: req.query.mapId
        });
    }
    getLocations.then(data => {
      res.json(data);
    });
  });

  router.get('/:id', (req, res) => {
    let getOneLocation = knex('locations')
      .select('*')
      .where({
        id: req.params.id
      });
    console.log(req.query);
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
        user_id: req.session.user_id
      }).then((rows) => {});
  });

  router.post('/:id/delete', (req, res) => {
    console.log(req.params.id);
    knex('locations').where({
      id: req.params.id
    }).del().then();
  });


  return router;
};
