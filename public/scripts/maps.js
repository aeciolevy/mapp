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


    infowindow.open(map, marker);
    saveLat = marker.getPosition().lat();
    saveLng = marker.getPosition().lng();
    saveLocation(saveLat, saveLng);

  });

}
