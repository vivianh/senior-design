(function () {
  'use strict';

  // Models
  var map = new exports.Map();
  var player = new exports.Player();

  // Views
  var mapView = new exports.MapView({
    model: map,
    el: '#map',
  });
  mapView.render();

  var playerView = new exports.PlayerView( { model: player } );

}());
