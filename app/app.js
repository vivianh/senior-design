(function () {
  'use strict';

  exports.state = new exports.State();
  exports.stateView = new exports.StateView({
    model: exports.state,
    el: '#state',
  });
  exports.stateView.render();

  exports.state.startGame();
}());
