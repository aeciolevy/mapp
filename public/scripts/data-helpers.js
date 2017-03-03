"use strict";

module.exports = function makeDataHelpers(knex) {
  return {

    getLocations: (mapID, callback) => {
      // GET MARKERS FOR SPECIFIC MAP
    },

    saveLocation: function(locationInfo, callback){
      console.log(locationInfo);
      // db.locations.push(locationInfo);
      // INSERT INFORMATION INTO DB
      callback(null, true);
    },

    deleteMarker: (markerID, callback) => {
      // DELETE MARKER
    }

  };
};
