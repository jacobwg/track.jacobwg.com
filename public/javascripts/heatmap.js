var Settings = {
  user_name: 'Jacob'
};

var map;
var positions, heatmap;

var update_data = function() {
  var uri = 'http://api.jacobwg.com/v1/location/history.json?';

  $('option:selected').each(function(idx){
    if ($(this).attr('data-option')) {
      uri += $(this).attr('data-option') + '=' + $(this).attr('data-value') + '&';
    }
  });

  console.log(uri);

  $.getJSON(uri + 'callback=?', function(data) {
    data = $.map(data, function(el, id) {
      return new google.maps.LatLng(el.latitude, el.longitude);
    });

    positions = new google.maps.MVCArray(data);

    heatmap.setData(positions);
  });
};

jQuery(function($) {

  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: new google.maps.LatLng(33.122026, -96.621323),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    map: map
  });

  $('select').on('change', function() {
    update_data();
  })

  update_data();

});
