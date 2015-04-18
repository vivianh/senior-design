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

    endGame: function () {
      console.log('game over');
      clearInterval(this.get('intervalId'));
    },

  });
}());
