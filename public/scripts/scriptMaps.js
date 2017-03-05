(function() {
  //Global Variables
  var currentMarker;
  var currentMap;
  var currentInfoWindow;
  //Initialized Map
  window.initMap = function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
    });
    currentMap = map;
    var infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBox')
    });
    currentInfoWindow = infowindow;
    //Add a new marker
    google.maps.event.addListener(map, 'click', function(event) {
      let marker = new google.maps.Marker({
        position: event.latLng,
        map: map
      });
      google.maps.event.addListener(marker, 'click', function() {
        currentMarker = marker;
        let markerID = marker.get('id');
        console.log('Marker ID:', markerID);
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
              `<h4 class="modal-title"> ${place.name} </h4>` +
              '<div class="modal-body">' +
                `<p> ${place.formatted_address}&hellip;</p>` +
              '</div>' +
              '<div class="modal-footer">' +
                '<button type="button" class="btn btn-primary">Save changes</button>' +
              '</div>');
            iw.setPosition(evt.latLng);
            iw.open(map);
          }
        });
      });
    }
    google.maps.event.addDomListener(window, "load", initialize);

  };



  $(function(){
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

    let getLocationData = function(data, marker){
      let obj = data[0];
      let infowindow = new google.maps.InfoWindow();
      infowindow.setContent(
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        `<h4 class="modal-title"> ${obj.title} </h4>` +
        '<div class="modal-body">' +
          `<p> ${obj.description}&hellip;</p>` +
        '</div>' +
        '<div class="modal-footer">' +
          '<button type="button" class="btn btn-primary">Save changes</button>' +
        '</div>'
        );
      infowindow.open(currentMap, marker);
    };

    let addMarkerCenterMap = function(data){
      var newBoundary = new google.maps.LatLngBounds();

      for (let i = 0; i < data.length; i++){
        let latLng = new google.maps.LatLng(data[i].latitude, data[i].longitude);
        let marker = new google.maps.Marker({
          position: latLng,
          map: currentMap,
          id: data[i].id,
          title: data.title
        });
        marker.addListener('click', function(){
          $.getJSON(`/locations/${marker.id}`).then(data => {
            getLocationData(data, marker);
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

