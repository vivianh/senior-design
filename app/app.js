(function () {
  'use strict';

  // Models
  exports.map = new exports.Map();
  exports.player = new exports.Player();

  // Views
  exports.mapView = new exports.MapView({
    model: exports.map,
    el: '#map',
  });
  exports.mapView.render();

  exports.playerView = new exports.PlayerView({
    model: exports.player,
    el: '#canvas',
  });
  exports.playerView.render();

}());
