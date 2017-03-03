"use strict";

const express = require('express');
const mapsRoutes = express.Router();


module.exports = (DataHelpers) => {



  mapsRoutes.post("/map_id/locations", (req, res) => {
      console.log('BODYY:::', req.body);
      res.locals.apiQuery = "&callback=initMap"
      if (!req.body.locationTitle) {
        res.status(400).json({
          error: 'invalid request: no data in POST body'
        });
        return;
      }

        let locationData = {
          title: req.body.locationTitle,
          description: req.body.locationDesc,
          image: req.body.locationImage,
          latitude: 'ATTITUDE',
          longitude: 'ONGITDUDE',
          map_id: 5,
          user_id: 3
        }

      DataHelpers.saveLocation(locationData, (err) => {
          if (err) {
            res.status(500).json({
              error: err.message
            });
          } else {
          res.status(201).send('SUCCESS');
        }
      });


  });

return mapsRoutes;
}
