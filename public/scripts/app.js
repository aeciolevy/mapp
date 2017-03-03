$(() => {
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

  $('#save').on('click', function(event) {
    event.preventDefault();
    console.log('CLICKEDDDD');
    alert('SDOFOSDJIOF');

    const $form = $(this).closest('form');
    console.log(this);
    // const $title = $form.find('.locationTitle').val();
    // const $desc = $form.find('.locationDlesc').val();
    // const $image = $form.find('.locationDesc').val();

    $.ajax({
      console.log('test');
      method: 'POST',
      url: 'http://localhost:8080/maps/map_id/location',
      data: $form.serialize()

    }).then((data) => {

      alert('TESTING');
      console.log('DATAAAAAAA', data);
      res.send("yay?");

    }).fail(function(xhr, err) {
      console.log(err);
      alert('LAME');
    });



  });
});
