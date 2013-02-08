var Settings = {
  user_name: 'Jacob'
};

jQuery(function($) {
  var map;

  var positions, positionArray, heatmap;

  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: new google.maps.LatLng(33.122026, -96.621323),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var fetchLocationHistory = function() {
    $.getJSON('http://localhost:3000/v1/location/history.json?callback=?', function(data) {
      data = $.map(data, function(el, id) {
        return new google.maps.LatLng(el.latitude, el.longitude);
      });

      positions = new google.maps.MVCArray(data);

      heatmap = new google.maps.visualization.HeatmapLayer({
        data: positions
      });

      heatmap.setMap(map);

      window.heatmap = heatmap;
    });
  };

  fetchLocationHistory();

});
