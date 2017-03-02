"use strict";

const express = require('express');
const mapsRoutes = express.Router();


module.exports = (DataHelpers) => {

  mapsRoutes.post("/map_id/locations", (req, res) => {
    console.log('BODYY:::', req.body);
    if (!req.body.locationTitle) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }
    res.locals.apiQuery = "&callback=initMap";
    const locationTitle = req.body.locationTitle;
    const locationDesc = req.body.locationDesc;
    const locationImage = req.body.locationImage;


  });

  return mapsRoutes;
}
