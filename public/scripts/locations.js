  let map;
  let marker;
  let infowindow;
  let messagewindow;
  let long = 0;
  let lats = 0;

  function initMap() {
    let california = {
      lat: 37.4419,
      lng: -122.1419
    };

    map = new google.maps.Map(document.getElementById('map'), {
      center: california,
      zoom: 13
    });

    infowindow = new google.maps.InfoWindow({
      content: document.getElementById('infoBOX')
    });

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

      console.log(marker.getPosition().lat(), marker.getPosition().lng());
      console.log(infowindow.content);

    });


    // google.maps.event.addListener(map, 'click', function(event) {
    //   marker = new google.maps.Marker({
    //     position: event.latLng,
    //     map: map
    //   });
    //
    //   alert('TEXTESDFSDFDSF');
    //
    //   $('#infoBOX').on('click', '#save', function(event) {
    //     console.log('CLICKEDDDD');
    //     event.preventDefault();
    //
    //     const $form = $(this).closest('form');
    //     const $title = $form.find('.locationTitle').val();
    //     const $desc = $form.find('.locationDesc').val();
    //     const $image = $form.find('.locationDesc').val();
    //
    //     $.ajax({
    //       method: 'POST',
    //       url: 'http://locationData:8080/maps/map_id/locations',
    //       data: $form.serialize()
    //     }).then((data) => {
    //       alert('TESTING');
    //       console.log('DATAAAAAAA', data);
    //     }).fail(function(xhr, err) {
    //       console.log(err);
    //       alert('LAME');
    //     });
    //
    //
    //
    //   });
    // });

  }
  //
  // $(() => {
  //
  //
  //   $('#infoBOX').on('click', '#save', function(event) {
  //     console.log('CLICKEDDDD');
  //     event.preventDefault();
  //
  //     const $form = $(this).closest('form');
  //     const $title = $form.find('.locationTitle').val();
  //     const $desc = $form.find('.locationDesc').val();
  //     const $image = $form.find('.locationDesc').val();
  //
  //     $.ajax({
  //       method: 'POST',
  //       url: 'http://locationData:8080/maps/map_id/locations',
  //       data: $form.serialize()
  //     }).then((data) => {
  //       alert('TESTING');
  //       console.log('DATAAAAAAA', data);
  //     }).fail(function(xhr, err) {
  //       console.log(err);
  //       alert('LAME');
  //     });
  //
  //
  //
  //   });
  // });
