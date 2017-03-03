"use strict";

function getLocations (mapID, callback) {
  // GET MARKERS FOR SPECIFIC MAP
}

function saveLocation(locationInfo, callback) {
  console.log(locationInfo);
  // db.locations.push(locationInfo);
  // INSERT INFORMATION INTO DB
  callback(null, true);
}

function deleteMarker (markerID, callback) {
  // DELETE MARKER
}
