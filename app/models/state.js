(function () {
  'use strict';

  exports.State = Backbone.Model.extend({

    defaults: {
      score: 0,
      startTime: 0,
      timeElapsed: 0,
    },

    initialize: function (options) {
      this.set('startTime', new Date());
      this.set('intervalId', setInterval(_.bind(this._updateState, this), 250));
    },

    _updateState: function () {
      this.set('timeElapsed', new Date() - this.get('startTime'));
    },

    incrementScore: function () {
      this.set('score', this.get('score') + exports.globals.SCORE_INCREMENT_KEY);
    },

    startGame: function () {
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
    },

    endGame: function () {
      clearInterval(this.get('intervalId'));
      $('#fill').toggleClass('visible');
      $('button#restart').toggleClass('visible');
      var that = this;
      $('button#restart').click(function () {
        that.startGame();
        $('#fill').toggleClass('visible');
        $('button#restart').toggleClass('visible');
      });
    },

  });
}());
