(function () {
  //Global Variables
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  var tagForm;
  var latestid;
  // Global Functions
  var htmlForm = function(obj, marker){
    if (tagForm && $('body').data('user')) {
      return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="http://fillmurray.com/350/150" class="modul-image img-rounded"></div>' +
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
        '<input type="text" class="locationImage form-control" placeholder="Image URL">' +
        '</div>' +
        '<button id="save-btn" type="submit" class="btn btn-primary btn-xs" data-dismiss="modal">Save</button>' +
        '</form>' +
        '</div>';
    } else {
      return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="http://fillmurray.com/350/150" class="modul-image img-rounded"></div>' +
        '<h3 class="modal-title">' + obj.title + '</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        "<p>" + obj.description + "</p>" +
        '<div class="coordinates">  ' + obj.latitude + ' , ' + obj.longitude + '</div>' +
        '</div>';
    }
  };

  var getLocationData2 = function(){
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
        debugger;
        if (currentMarker.new){
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


    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

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
