  let map;
  let marker;
  let infowindow;
  let messagewindow;

  function initMap() {
    var california = {
      lat: 37.4419,
      lng: -122.1419
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: california,
      zoom: 13
    });

    infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBOX')
    })

    messagewindow = new google.maps.InfoWindow({
      content: document.getElementById('message')
    });

    google.maps.event.addListener(map, 'click', function(event) {
      marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });

      console.log(marker.position);


      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });

      console.log(marker.getPosition().lat(), marker.getPosition().lng())
    });
  }



  // function saveCoords() {
  //   const latlng = marker.getPosition();
  //
  //   req.body.lat = latlng.lat();
  //   req.body.lng = latlng.lng();
  //
  //   console.log('TESTESTSETESTSET::::::::',req.body);
  //
  // }
  //   request.open('GET', url, true);
  //   request.send(null);
  // }

  function doNothing() {}
