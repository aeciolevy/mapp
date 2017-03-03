$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  $('#infoBOX').on('click', '#save', function(event) {
    console.log('CLICKEDDDD');
    event.preventDefault();

    const $form = $(this).closest('form');
    console.log('THIS', this);
    const $title = $form.find('.locationTitle').val();
    const $desc = $form.find('.locationDesc').val();
    const $image = $form.find('.locationDesc').val();

    $.ajax({
      method: 'POST',
      url: 'http://locationData:8080/maps/map_id/locations',
      data: $form.serialize()
    }).then((data) => {
      alert('TESTING');
      console.log('DATAAAAAAA', data);
    }).fail(function(xhr, err) {
      console.log(err);
      alert('LAME');
    });



  });



});
