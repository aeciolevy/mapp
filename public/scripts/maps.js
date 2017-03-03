let map;
let marker;
let infowindow;
let messagewindow;
let long = 0;
let lats = 0;

function initMap() {
  let california = {
    lat: 37.4419,
    lng: -122.1419
  };

  map = new google.maps.Map(document.getElementById('map'), {
    center: california,
    zoom: 13
  });

  infowindow = new google.maps.InfoWindow({
    content: document.getElementById('infoBOX')
  });

  messagewindow = new google.maps.InfoWindow({
    content: document.getElementById('message')
  });

  google.maps.event.addListener(map, 'click', function(event) {
    marker = new google.maps.Marker({
      position: event.latLng,
      map: map
    });
    $('#save').on('click', (event) => {
      console.log('test');
    });


    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    console.log(marker.getPosition().lat(), marker.getPosition().lng());

  });
}
