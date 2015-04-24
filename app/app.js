(function () {
  'use strict';

  exports.state = new exports.State();
  exports.stateView = new exports.StateView({
    model: exports.state,
    el: '#state',
  });
  exports.stateView.render();

  // Models
  exports.player = new exports.Player();
  exports.map = new exports.Map();

  // Views
  exports.playerView = new exports.PlayerView({
    model: exports.player,
    el: '#canvas',
  });
  exports.playerView.render();

  exports.mapView = new exports.MapView({
    model: exports.map,
    el: '#map',
  });
  exports.mapView.render();

}());
