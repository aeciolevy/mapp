(function() {
  //Global Variables
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  var tagForm;
  //Initialized Map
  window.initMap = function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {});

    currentMap = map;
    var infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });


    //Add a new marker
    google.maps.event.addListener(map, 'click', function(event) {
      let marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      google.maps.event.addListener(marker, 'click', function() {
        currentMarker = marker;
        currentInfoWindow = infowindow;
        infowindow.open(map, marker);
      });
    });


    //Handle Places events
    function initialize() {
      var iw = new google.maps.InfoWindow();
      google.maps.event.addListener(map, 'click', function(evt) {
        evt.stop();
         var request = {
            placeId: evt.placeId
          };

        service = new google.maps.places.PlacesService(map);
        let data = service.getDetails(request, (place, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            console.log(place);
            iw.setContent(
              '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
              '<div class="modal-header">' +
              `<h3 class="modal-title">  ${place.name} </h3>` +
              '</div>' +
              '<div class="modal-body">' +
              `<p> ${place.formatted_address} </p>` +
              '<div class="coordinates"></div>' +
              '</div>' +
              '<div class="modal-footer">' +
              '<button id="save-btn3" type="button" class="btn btn-primary btn-xs" data-dismiss="modal">add to Map</button>' +
              '</div>');
            iw.setPosition(evt.latLng);
            iw.open(map);
          }
        });
      });
    }

    google.maps.event.addDomListener(window, "load", initialize);
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

      this.reset();
      currentInfoWindow.close();
    });



    let htmlForm = function(obj){
      if(tagForm){
      return '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<div class="modal-header">' +
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
        '</div>';
      } else {
        return '<div id="infoBox">' +
                 '<div class="modal-header">' +
                 '<h4 class="modal-title">Edit Location</h4>' +
                 '</div>' +
                 '<form id="infoForm" method="POST" action="/maps/map_id/location">' +
                   '<div class="form-group">' +
                     '<input type="text" class="locationTitle form-control" value="'+ obj.title + '">' +
                   '</div>' +
                   '<div class="form-group">' +
                     '<textarea type="text" class="locationDesc form-control" rows="8" placeholder="Description">' + obj.description + '</textarea>' +
                   '</div>' +
                   '<div class="form-group">' +
                     '<input type="text" class="locationImage form-control" value="Image URL">' +
                   '</div>' +
                   '<button id="save" type="submit" class="btn btn-primary btn-xs">Save</button>' +
                 '</form>' +
               '</div>';
      }
    };
    let getLocationData = function(data, marker) {
      let obj = data[0];
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(htmlForm(obj));
      currentInfoWindow = infowindow;
      infowindow.open(currentMap, marker);
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
          tagForm = true;
          currentMarker = marker;
          $.getJSON(`/locations/${marker.id}`).then(result => {
            //Retrieve data from an existing location
            getLocationData(result, marker);
            let $btn = $('#save-btn');
            let $delLocation = $('#delete-btn');
            //Edit Location DAta
            $('#edit-btn').on('click', function(event) {
              currentInfoWindow.close();
              event.preventDefault();
              tagForm = false;
              getLocationData(result, marker);
            });
            //Delete Marker
            $delLocation.on('click', function(event){
              $.ajax({
                method: 'POST',
                url: `/locations/${marker.id}/delete`
              }).then(currentMarker.setMap(null));
              currentInfoWindow.close();
            });
            //Update Location
            $btn.on('click', function(){
              alert('Hello');
            });
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