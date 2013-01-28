
jQuery(function($) {

  var map;
  var jacob_marker, viewer_marker;
  var jacob_circle, jacob_radius;

  var jacob_coords, previous_time;

  map = L.map('map');
  map.addLayer(new L.Google('ROADMAP'));
  map.locate({watch: true});

  var onViewerLocationUpdate = function(e) {
    viewer_radius = e.accuracy / 2;

    if (viewer_marker) {
      viewer_marker.setLatLng(e.latlng);
    } else {
      viewer_marker = L.marker(e.latlng).addTo(map).bindPopup('Your Location');
    }
  };
  map.on('locationfound', onViewerLocationUpdate);

  var updateJacobLocation = function(e) {
    if (previous_time && e.time.format() === previous_time.format()) {
      return;
    } else {
      previous_time = e.time;
    }

    jacob_radius = e.accuracy;

    if (jacob_marker) {
      jacob_marker.setLatLng(e.latlng);
    } else {
      jacob_marker = L.marker(e.latlng).addTo(map);
    }

    jacob_marker.bindPopup(Settings.user_name + ' is within ' + jacob_radius + ' meters from this point on the map<br />Last seen <abbr class="timeago" title="' + e.time.format() + '">' + e.time.toString() + '</abbr>');

    if (jacob_circle) {
      jacob_circle.setLatLng(e.latlng).setRadius(jacob_radius);
    } else {
      jacob_circle = L.circle(e.latlng, jacob_radius, {color: '#000'}).addTo(map);
    }

    map.setView(e.latlng, 15);
    jacob_marker.openPopup();
    $('abbr.timeago').timeago();
  };

  var fetchJacobLocation = function() {
    $.getJSON('http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20json%20where%20url%3D%22http%3A%2F%2Flatitude.google.com%2Flatitude%2Fapps%2Fbadge%2Fapi%3Fuser%3D' + Settings.user_id + '%26type%3Djson%22&format=json&diagnostics=true', function(data) {
      if (!data.query.results) return;
      updateJacobLocation({
        accuracy: data.query.results.json.features.properties.accuracyInMeters,
        latlng: new L.LatLng(data.query.results.json.features.geometry.coordinates[1], data.query.results.json.features.geometry.coordinates[0]),
        time: moment.unix(data.query.results.json.features.properties.timeStamp)
      });
    });
  };

  setInterval(fetchJacobLocation, 2000);

});