(function() {
  //Global Variables
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  var currentPlace;
  var currentAddress;
  var tagForm;
  var latestid;
  // Global Functions
  var htmlForm = function(obj, marker) {
    if (tagForm && $('body').data('user')) {
      return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="' + obj.image + '" class="modal-image img-rounded"></div>' +
        '<h3 class="modal-title">' + obj.title + '</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        "<p>" + obj.description + "</p>" +
        '<div class="coordinates">  ' + obj.latitude + ' , ' + obj.longitude + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button id="edit-btn" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">Edit</button>' +
        '<button id="delete-btn" type="button" class="btn btn-danger btn-xs">Delete</button>' +
        '</div>';
    } else if ($('body').data('user')) {
      // debugger;
      return '<div id="infoBox">' +
        '<div class="modal-header">' +
        '<h4 class="modal-title">Edit Location</h4>' +
        '</div>' +
        '<form id="infoFormW" method="POST" action="/locations/' + marker.id + '/update"' + '>' +
        '<div class="form-group">' +
        '<input type="text" class="locationTitle form-control" name="title" value="' + obj.title + '">' +
        '</div>' +
        '<div class="form-group">' +
        '<textarea type="text" class="locationDesc form-control" name="desc" rows="4" placeholder="Description">' + obj.description + '</textarea>' +
        '</div>' +
        '<div class="form-group">' +
        '<input type="text" class="locationImage form-control" placeholder="Image URL" value="' + obj.image + '">' +
        '</div>' +
        '<button id="save-btn" type="submit" class="btn btn-primary btn-xs" data-dismiss="modal">Save</button>' +
        '</form>' +
        '</div>';
    } else {
      return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="' + obj.image + '" class="modal-image img-rounded"></div>' +
        '<h3 class="modal-title">' + obj.title + '</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        "<p>" + obj.description + "</p>" +
        '<div class="coordinates">  ' + obj.latitude + ' , ' + obj.longitude + '</div>' +
        '</div>';
    }
  };

  var getLocationData2 = function() {
    $.getJSON(`/locations/${currentMarker.id}`).then(data => {
      let obj = data[0];
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(htmlForm(obj, currentMarker));
      currentInfoWindow = infowindow;
      infowindow.open(currentMap, currentMarker);
    });
  };

  $('body').on('click', '#edit-btn', function(event) {
    currentInfoWindow.close();
    event.preventDefault();
    tagForm = false;
    getLocationData2();
  });

  // Delete Marker
  $('body').on('click', '#delete-btn', function(event) {
    $.ajax({
      method: 'POST',
      url: `/locations/${currentMarker.id}/delete`
    }).then(currentMarker.setMap(null));
    currentInfoWindow.close();
  });

  $('body').on('submit', '#infoFormW', function(event) {
    event.preventDefault();
    const $title = $('.locationTitle').val();
    const $desc = $('.locationDesc').val();
    const $image = $('.locationImage').val();
    $.ajax({
      method: 'POST',
      url: `/locations/${currentMarker.id}/update`,
      data: {
        title: $title,
        desc: $desc,
        image: $image
      }
    }).then(currentInfoWindow.close());
  });

  $('body').on('click', '#save-place-btn', function(event) {
    event.preventDefault();
    let $map = $('#map');
    let $data = $map.data();
    $.ajax({
      method: 'POST',
      url: `/locations/${$data.mapid}`,
      data: {
        title: currentPlace.name,
        description: currentAddress,
        image: currentPlace.photos[0].getUrl(({
          'maxWidth': 250,
          'maxHeight': 300
        })),
        latitude: currentMarker.getPosition().lat(),
        longitude: currentMarker.getPosition().lng()
      }
    }).then(responseText => {
      currentMarker.id = responseText;
      currentMarker.new = false;
      currentInfoWindow.close();
      alert(currentMarker.id);
      currentMarker.addListener('click', () => {
        tagForm = true;
        getLocationData2();
        currentInfoWindow = infowindow;
      })
    });

  });


  //Initialized Map
  window.initMap = function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.LEFT_BOTTOM
      }
    });
    currentMap = map;
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var fav = document.getElementById('control-favorite');

    map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(fav);



    var infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });

    currentInfoWindow = infowindow;

    google.maps.event.addListener(map, 'click', function(event) {
      $('#infoBox').css('display', 'inline');
      var markerNew = new google.maps.Marker({
        position: event.latLng,
        map: map,
        id: '',
        new: true
      });

      google.maps.event.addListener(markerNew, 'click', function() {
        currentMarker = markerNew;

        if (currentMarker.new) {
          infowindow.open(map, markerNew);
          currentInfoWindow = infowindow;
        } else {
          currentInfoWindow = infowindow;
          tagForm = true;
          getLocationData2();
        }
        map.addListener('click', function(e) {
          currentInfoWindow.close();
        });
      });
    });

    // Autocomplete fucntions
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    autocomplete.addListener('place_changed', function() {

      var infowindow = new google.maps.InfoWindow();
      var infowindowContent = document.getElementById('infowindow-content');
      infowindow.setContent(infowindowContent);
      var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
      });

      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      currentPlace = place;
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }


      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
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

      currentAddress = address;
      console.log(place.photos);
      let imageURL = place.photos[0].getUrl(({
        'maxWidth':
        3
      }));

      infowindow.setContent(
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="' + imageURL + '" class="img-rounded"></div>' +
        '<h3 class="modal-title">' + place.name + '</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        "<p>" + address + "</p>" +
        '<div class="coordinates">' + place.geometry.location.lat() + ' , ' + place.geometry.location.lat() + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button id="save-place-btn" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">Save</button>' +
        '</div>'
      );

      currentInfoWindow = infowindow;
      currentMarker = marker;

      infowindow.open(map, marker);
      currentMap.addListener('place_changed', function() {
        currentInfoWindow.close();
        infowindow.close();
      });
    });
  };

  $(function() {
    $('#infoForm').submit(function(event) {
      event.preventDefault();
      let $map = $('#map');
      let $data = $map.data();
      const $form = $(this);
      const $title = $('.locationTitle').val();
      const $desc = $('.locationDesc').val();
      const $image = $('.locationImage').val();
      $.ajax({
        method: 'POST',
        url: `/locations/${$data.mapid}`,
        data: {
          title: $title,
          description: $desc,
          image: $image,
          latitude: currentMarker.getPosition().lat(),
          longitude: currentMarker.getPosition().lng()
        }
      }).then(responseText => {
        currentMarker.id = responseText;
        currentMarker.new = false;
      });
      currentInfoWindow.close();
      this.reset();
    });

    let addMarkerCenterMap = function(data) {
      var newBoundary = new google.maps.LatLngBounds();
      for (let i = 0; i < data.length; i++) {
        let latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
        let marker = new google.maps.Marker({
          position: latLng,
          map: currentMap,
          id: data[i].id,
          title: data.title
        });
        marker.addListener('click', function() {
          tagForm = true;
          currentMarker = marker;
          getLocationData2();

        });
        newBoundary.extend(marker.position);
      }
      currentMap.fitBounds(newBoundary);
    };
    let $map = $('#map');
    let $data = $map.data();
    $.getJSON(`/locations/?show=maps&mapId=${$data.mapid}`).then(addMarkerCenterMap);
  });
})();
