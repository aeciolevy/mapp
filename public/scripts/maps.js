(function() {
  var currentMarker;
  $(function() {
    //
    $('#infoForm').submit(function(event) {
      console.log('testing this', this);
      event.preventDefault();
      console.log('testing this scope', this);
      alert('NEW?');


      const $form = $(this);
      const $title = $('.locationTitle').val();
      const $desc = $('.locationDesc').val();
      const $image = $('.locationImage').val();
      console.log('title: ', $title);
      console.log('desc: ', $desc);
      console.log('image: ', $image);
      $.ajax({
        method: 'POST',
        url: 'http://localhost:8080/maps/map_id/location',
        data: {
          title: $title,
          description: $desc,
          image: $image,
          latitude: currentMarker.getPosition().lat(),
          longitude: currentMarker.getPosition().lng()
        }
      }).then();
    });
  });

  window.initMap = function initMap() {
    let messagewindow;
    let california = {
      lat: 37.4419,
      lng: -122.1419
    };

    let map = new google.maps.Map(document.getElementById('map'), {
      center: california,
      zoom: 13
    });

    let infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });

    ////////////////////////////////////////////







    //////////////////////////////////////

    // messagewindow = new google.maps.InfoWindow({
    //   content: document.getElementById('message')
    // });

    google.maps.event.addListener(map, 'click', function(event) {
      let marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });


      google.maps.event.addListener(marker, 'click', function() {
        currentMarker = marker;
        infowindow.open(map, marker);
      });
    });



  };
})();
