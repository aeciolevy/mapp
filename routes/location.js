"use strict";

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  //Show All locations
  router.get('/', (req, res) => {
    let getAllLocations = knex('locations')
      .select('*');
    getAllLocations.then(data => {
      res.json(data);
    });
  });
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
      id: req.params.id
    });
    getOneLocation.then(data => {
      res.json(data);
    });
  });

  //Update Location Data
  router.post('/:id', (req, res) => {});

  //Delete Location
  router.post('/:id/delete', (req, res) => {});

  return router;
};
