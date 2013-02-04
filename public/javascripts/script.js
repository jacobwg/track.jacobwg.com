var Settings = {
  user_name: 'Jacob'
};

jQuery(function($) {
  var map;

  var marker, circle, info, position;

  var previous = {
    latitude: 0,
    longitude: 0,
    accuracy: 0,
    previous_time: 0,
    zoom: 0
  }

  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center: new google.maps.LatLng(33.122026, -96.621323),
    zoom: 11,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var getMarker = function() {
    if (!marker)
      marker = new google.maps.Marker({
        title: Settings.user_name + '\'s Current Location',
        map: map
      });
    return marker;
  };

  var getCircle = function() {
    if (!circle)
      circle = new google.maps.Circle({
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        map: map
      });
    return circle;
  }

  var getInfo = function() {
    if (!info) {
      info = new google.maps.InfoWindow();
      google.maps.event.addListener(getMarker(), 'click', function() {
        info.open(map, getMarker());
      });
    }
    return info;
  }

  var getInfoText = function(data) {
    return Settings.user_name + ' was within ' + Math.round(data.accuracy) + ' meters from this point<br />at ' + moment(data.time).format('h:mm:ss a on MMMM Do, YYYY');
  }

  var updateJacobLocation = function(data) {

    if (data.accuracy != previous.accuracy) {
      previous.accuracy = data.accuracy;

      getCircle().setRadius(data.accuracy);
    }

    if (data.accuracy != previous.accuracy || data.time != previous.time) {
      previous.accuracy = data.accuracy;
      previous.time = data.time;

      getInfo().setContent(getInfoText(data));
    }

    if (previous.zoom === 0) {
      map.setZoom(15);
      previous.zoom = 15;
    }

    if (data.latitude != previous.latitude || data.longitude != previous.latitude) {
      previous.latitude = data.latitude;
      previous.longitude = data.longitude;

      position = new google.maps.LatLng(data.latitude, data.longitude);

      getMarker().setPosition(position);
      getCircle().setCenter(position);

      map.panTo(position);
      getInfo().open(map, getMarker());
    }

  };

  var fetchJacobLocation = function() {
    $.getJSON('/location.json', function(data) {
      updateJacobLocation({
        accuracy: data.horizontalAccuracy,
        latitude: data.latitude,
        longitude: data.longitude,
        time: data.timeStamp
      });
    });
  };

  setInterval(fetchJacobLocation, 6000);

});
