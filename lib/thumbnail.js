require('dotenv').config();

const API_KEY = process.env.GOOGLE_API;
const ENV = process.env.ENV || "development";
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig[ENV]);


let apiUrl = "https://maps.googleapis.com/maps/api/staticmap?center=Brooklyn+Bridge,New+York,NY&zoom=13&size=640x640&maptype=roadmap";

module.exports = {
  createUrl: function(rawmap) {
    // knex.select('*').from('locations').where({map_id: rawmap.id}).then(locations =>
    //   locations.reduce((urlstring, location) => {
    //   }, apiUrl)
    // );
    rawmap.thumbUrl = apiUrl + "&key=" + API_KEY;
  }
};
