$(document).ready(function() {
  $("#control-favorite").on("click", function () {
    const map_id = $(this).data("map-id");
    const isFaved = $(this).data("favorited");
    console.log(map_id, isFaved);
    if (isFaved) {
      $(this).data("favorited", null);
      $(this).removeClass("favorited");
    } else {
      $(this).data("favorited", true);
      $(this).addClass("favorited");
    }
    $.ajax({
      data: {
        "map_id": map_id,
        "isFaved": isFaved
      },
      method: 'POST',
      url: '/maps/favorite'
    });
  });
});
