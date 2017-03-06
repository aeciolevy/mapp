(function () {
  //Global Variables
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  var tagForm;
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
      let marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      google.maps.event.addListener(marker, 'click', function() {

        currentMarker = marker;
        currentInfoWindow = infowindow;

        infowindow.open(map, marker);
        map.addListener('click', function(e) {
          currentInfoWindow.close();
        });

      });
    });


    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);


    //Handle Places events Testing Do not DELETE
    // function initialize() {
    //   var iw = new google.maps.InfoWindow();
    //   google.maps.event.addListener(map, 'click', function(evt) {
    //     evt.stop();
    //      var request = {
    //         placeId: evt.placeId
    //       };

    //     service = new google.maps.places.PlacesService(map);
    //     let data = service.getDetails(request, (place, status) => {
    //       if (status == google.maps.places.PlacesServiceStatus.OK) {
    //         console.log(place);
    //         iw.setContent(
    //           '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
    //           '<div class="modal-header">' +
    //           `<h3 class="modal-title">  ${place.name} </h3>` +
    //           '</div>' +
    //           '<div class="modal-body">' +
    //           `<p> ${place.formatted_address} </p>` +
    //           '<div class="coordinates"></div>' +
    //           '</div>' +
    //           '<div class="modal-footer">' +
    //           '<button id="save-btn3" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">add to Map</button>' +
    //           '</div>');
    //         iw.setPosition(evt.latLng);
    //         iw.open(map);
    //       }
    //     });
    //   });
    // }

    // google.maps.event.addDomListener(window, "load", initialize);


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
      }).then();
      currentInfoWindow.close();
      this.reset();
    });


    let htmlForm = function(obj, marker){
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

    let getLocationData = function(data, marker) {
      let obj = data[0];
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(htmlForm(obj, marker));
      currentInfoWindow = infowindow;
      infowindow.open(currentMap, marker);
      // currentMap.addListener('click', function(e) {
      //   infowindow.close();
      // });
    };

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

    let addMarkerCenterMap = function(data) {
      var newBoundary = new google.maps.LatLngBounds();
      //TODO make foreach
      for (let i = 0; i < data.length; i++) {
        let latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
        let marker = new google.maps.Marker({
          position: latLng,
          map: currentMap,
          id: data[i].id,
          title: data.title
        });

        //TODO change to event delegation rather than preexisting markers
        marker.addListener('click', function() {
          tagForm = true;
          currentMarker = marker;
          $.getJSON(`/locations/${marker.id}`).then(result => {
            //Retrieve data from an existing location
            getLocationData(result, marker);
            let $delLocation = $('#delete-btn');

            //Edit Location Data
            $('#edit-btn').on('click', function(event) {
              currentInfoWindow.close();
              event.preventDefault();
              tagForm = false;
              getLocationData(result, marker);
            });
            //Delete Marker
            $delLocation.on('click', function(event) {
              $.ajax({
                method: 'POST',
                url: `/locations/${marker.id}/delete`
              }).then(currentMarker.setMap(null));
              currentInfoWindow.close();
            });
            //Update Locationnp

          });

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
