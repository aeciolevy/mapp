(function() {
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  var allMarkers = [];
  window.initMap = function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {});

    currentMap = map;
    var infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });

    currentInfoWindow = infowindow;



    google.maps.event.addListener(map, 'click', function(event) {
      $('#infoBox').css('display', 'inline');
      let marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      allMarkers.push(marker);
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

      this.reset();
      currentInfoWindow.close();
    });

    let getLocationData = function(data, marker) {
      let obj = data[0];
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
        '<div><img src="http://fillmurray.com/350/150" class="modul-image img-rounded"></div>' +
        '<h3 class="modal-title">' + obj.title + '</h3>' +
        '</div>' +
        '<div class="modal-body">' +
        "<p>I mean, why would a poptart want to live inside a toaster, Rick? I mean, that would be like the scariest place for them to live. You know what I mean? S-S-Samantha. Holy crap, Morty, run! Run for your life, Morty, run! I-I've never seen that thing before in my life, Morty, I don't even know what the hell it is! We-we gotta get out of here, Morty, it's gonna kill us! We're gonna die, Morty! We're gonna die! Listen, Morty, I hate to break it to you but what people call love is just a chemical reaction that compels animals to breed.</p>" +
        '<div class="coordinates">  ' + obj.latitude +' , ' + obj.longitude + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button id="save-btn" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">Save</button>' +
        '<button id="edit-btn" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">Edit</button>' +
        '<button id="delete-btn" type="button" class="btn btn-danger btn-xs">Delete</button>' +
        '</div>'
      );
      infowindow.open(currentMap, marker);
      currentMap.addListener('click', function(e) {
          infowindow.close();
      });
    };

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
          $.getJSON(`/locations/${marker.id}`).then(data => {
            getLocationData(data, marker);
          });
        });

        allMarkers.push(marker);
        newBoundary.extend(marker.position);
      }
      console.log(allMarkers);
      currentMap.fitBounds(newBoundary);
    };

    $.getJSON("/locations/").then(function(data) {
      addMarkerCenterMap(data);
      // getMarkerContent(data);
    });



  })

})();
