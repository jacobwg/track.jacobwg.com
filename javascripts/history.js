
var Settings = {
  user_name: 'Jacob'
};

var map;
var positions, heatmap;

var update_data = function() {
  var uri = 'http://localhost:3000/v1/location/history?';

  $('option:selected').each(function(idx){
    if ($(this).attr('data-option')) {
      uri += $(this).attr('data-option') + '=' + $(this).attr('data-value') + '&';
    }
  });

  $.getJSON(uri + 'callback=?', function(data) {
    console.log(data);

    var points = [];

    _.each(data.y2013, function(week) {

      $.each(week, function(id, count) {
        var parts = id.replace(/_/g, '.').replace(/[l]/g, '').split(':');
        points.push({
          lat: parseFloat(parts[0]),
          lng: parseFloat(parts[1]),
          count: parseInt(count)
        });
      });

    });

    var max = _.max(points, function(point) {
      return point.count;
    }).count;

    heatmap.setDataSet({data: points, max: max});
  });
};

jQuery(function($) {

  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: new google.maps.LatLng(33.122026, -96.621323),
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      scrollwheel: true,
      draggable: true,
      navigationControl: true,
      mapTypeControl: false,
      scaleControl: true,
      disableDoubleClickZoom: false
  });

  heatmap = new HeatmapOverlay(map, {
    "radius": 10,
    "visible": true,
    "opacity": 60
  });

  google.maps.event.addListenerOnce(map, "idle", function(){
    update_data();
  });

  google.maps.event.addListenerOnce(map, "drag", function(){
    update_data();
  });

  $('select').on('change', function() {
    update_data();
  });

});
