// TODO make sure markers are removed if not saved
// TODO pop infowindow with marker details when clicked on


// https://developers.google.com/maps/documentation/javascript/examples/places-searchbox

function saveLocation(lat, lng) {
  $('#infoForm').submit(function(event) {
    event.preventDefault();
    console.log(this);
    alert('NEW?');

    const $form = $(this).closest('form');
    const $title = $form.find('.locationTitle').val();
    const $desc = $form.find('.locationDesc').val();
    const $image = $form.find('.locationImage').val();

    $.ajax({
      method: 'POST',
      url: 'http://localhost:8080/maps/map_id/location',
      data: {
        title: $title,
        description: $desc,
        // TODO image: $image,
        latitude: lat,
        longitude: lng
      }

    }).then((data) => {

      alert('THEN');
      console.log('DATAAAAAAA', data);
      res.send("yay?");

    }).fail(function(xhr, err) {
      console.log(err);
      alert('LAME');
    });

  });
}

function initMap() {
  let map;
  let marker;
  let infowindow;
  let messagewindow;
  let saveLat;
  let saveLng;
  let california = {
    lat: 37.4419,
    lng: -122.1419
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: california,
    zoom: 13
  });

  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');
  // var types = document.getElementById('type-selector');
  var strictBounds = document.getElementById('strict-bounds-selector');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17); // Why 17? Because it looks good.
    }
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-icon'].src = place.icon;
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.open(map, marker);
  });



  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('infoBox')
  });



  // messagewindow = new google.maps.InfoWindow({
  //   content: document.getElementById('message')
  // });

  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    console.log('MARKER', marker.position);


    infowindow.open(map, marker);
    saveLat = marker.getPosition().lat();
    saveLng = marker.getPosition().lng();
    saveLocation(saveLat, saveLng);

  });

}


function initAutocomplete() {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
