require('dotenv').config();

const API_KEY = process.env.GOOGLE_API;
const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);

let baseUrl = `https://maps.googleapis.com/maps/api/staticmap?size=640x640&maptype=roadmap&format=png&key=${API_KEY}`;

module.exports = {
  createUrl: function(map) {
    return knex.select('*').from('locations').where({map_id: map.id}).then(locations => {
      if (locations.length === 0) {
        map.thumbURL = 'https://fillmurray.com/640/640';
      } else {
        let urlWithMarkers = locations.reduce(
          (url, loc) => url + `&markers=color:red%7C${loc.latitude},${loc.longitude}`,
          baseUrl);
        map.thumbURL = urlWithMarkers;
      }
      return map;
    });
    // console.log("promise is pending, but here's the map", map);
    // return map;
  }
};
