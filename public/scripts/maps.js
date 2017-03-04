(function() {
  var currentMarker;
  var currentMap;

  window.initMap = function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {});

    currentMap = map;
    let infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });


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
    ////////////

    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);


  };




  $(function() {

    $('#infoForm').submit(function(event) {
      event.preventDefault();
      const $form = $(this);
      const $title = $('.locationTitle').val();
      const $desc = $('.locationDesc').val();
      const $image = $('.locationImage').val();
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



    let addMarkerCenterMap = function(data) {
      var newBoundary = new google.maps.LatLngBounds();
      for (let i = 0; i < data.length; i++) {
        var latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
        var marker = new google.maps.Marker({
          position: latLng,
          map: currentMap,
          id: data[i].id,
          title: data[i].title
        });
        newBoundary.extend(marker.position);

      }
      currentMap.fitBounds(newBoundary);
    };


    let getMarkerContent = (data) => {
      for (let i = 0; i < data.length; i++) {

        var marker = new google.maps.Marker({
          position: new google.maps.LatLng(data[i].latitude, data[i].longitude),
          map: currentMap,
          title: data[i].title
        });

        google.maps.addListener(marker, 'click', function(marker, i) {
          // return function() {
          console.log("TEST: ");
          infowindow.setContent(data[i].description);
          infowindow.open(currentMap, marker);
          // }
        });

      }

    };

    $.getJSON("/locations/").then(function(data) {
      addMarkerCenterMap(data);
      // getMarkerContent(data);
    });



  })

})();
