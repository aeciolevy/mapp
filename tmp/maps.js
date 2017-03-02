"use strict";

const express = require('express');
const mapsRoutes = express.Router();


module.exports = (DataHelpers) => {



  mapsRoutes.post("/map_id/locations", (req, res) => {
      console.log('BODYY:::', req.body);
      if (!req.body.locationTitle) {
        res.status(400).json({
          error: 'invalid request: no data in POST body'
        });
        return;
      }

      locationData = {
        title: req.body.locationTitle,
        description: req.body.locationDesc,
        image: locationImage,
        latitude: 49.2827,
        longitude: -123.1207,
        map_id: 5,
        user_id: 3
      }
      DataHelpers.saveLocation(locationData, (err) => {
          if (err)
            res.status.json({
              error: err.message
            });
        } else {
          res.status(201).send();
        }
      });


  });

return mapsRoutes;
}
