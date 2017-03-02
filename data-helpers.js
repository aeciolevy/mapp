"use strict";

module.exports = function makeDataHelpers(db) {
  return {

    getLocations: (mapID, callback) => {
      // GET MARKERS FOR SPECIFIC MAP
    },

    saveLocation: function(markerInfo, callback){
      db.locations.push(markerInfo);
      console.log(markerInfo);
      // INSERT INFORMATION INTO DB
      callback(null, true);
    },

    deleteMarker: (markerID, callback) => {
      // DELETE MARKER
    }

  };
};
