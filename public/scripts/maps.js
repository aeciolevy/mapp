let map;
let marker;
let infowindow;
let messagewindow;
var long = 0;
var lats = 0;

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


    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });

    console.log(marker.getPosition().lat(), marker.getPosition().lng());


    $('#infoForm').submit( function(event) {
      event.preventDefault();
      console.log(this);
      alert('NEW?');

      const $form = $(this).closest('form');
      const $title = $form.find('.locationTitle').val();
      const $desc = $form.find('.locationDesc').val();
      const $image = $form.find('.locationImage').val();

      let testing = $('.locationTitle, .locationDesc, .locationImage').serialize();
      console.log(testing);

      $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/maps/map_id/location',
        data: $form.serialize()

      }).then((data) => {

        alert('TESTING');
        console.log('DATAAAAAAA', data);
        res.send("yay?");

      }).fail(function(xhr, err) {
        console.log(err);
        alert('LAME');
      });

    });

  });

}
