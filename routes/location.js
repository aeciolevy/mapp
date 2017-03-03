"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  //Show Location Data
  router.get('/:id', (req, res) => {
    res.send('Location Id tested');
  });

  //Update Location Data
  router.post('/:id', (req, res) => {
  });

  //Delete Location
  router.post('/:id/delete', (req, res) => {
  });

  return router;
};
