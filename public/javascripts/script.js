
jQuery(function($) {
  var map;

  var marker, circle, info, content;

  var previous_time = 0;

  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: new google.maps.LatLng(33.122026, -96.621323),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var updateJacobLocation = function(e) {

    if (marker) {
      marker.setPosition(e.latlng);
    } else {
      marker = new google.maps.Marker({
        position: e.latlng,
        title: 'Jacob\'s Current Location'
      });
      marker.setMap(map);
    }

    content = Settings.user_name + ' was within ' + Math.round(e.accuracy) + ' meters from this point<br />at ' + e.time.format('h:mm:ss a on MMMM Do, YYYY');

    if (info) {
      info.setContent(content);
    } else {
      info = new google.maps.InfoWindow({
        content: content
      });
      google.maps.event.addListener(marker, 'click', function() {
        info.open(map, marker);
      });
    }

    if (circle) {
      circle.setCenter(e.latlng);
      circle.setRadius(parseInt(e.accuracy));
    } else {
      circle = new google.maps.Circle({
        center: e.latlng,
        radius: parseInt(e.accuracy),
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35
      });
      circle.setMap(map);
    }

    map.setZoom(15);
    map.panTo(e.latlng);
    info.open(map, marker);

  };

  var fetchJacobLocation = function() {
    $.getJSON('/location.json', function(data) {
      if (parseInt(data.location.timeStamp) > previous_time) {
        updateJacobLocation({
          accuracy: data.location.horizontalAccuracy,
          latlng: new google.maps.LatLng(data.location.latitude, data.location.longitude),
          time: moment(data.location.timeStamp)
        });
        previous_time = parseInt(data.location.timeStamp);
      }
    });
  };

  setInterval(fetchJacobLocation, 6000);

});
