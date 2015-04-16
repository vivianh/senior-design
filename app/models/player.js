(function () {
  'use strict';

  exports.Player = Backbone.Model.extend({

    defaults: {
      col: 8,
      direction: exports.globals.MAP_DIRECTION_RIGHT,
      margin: 0,
      numKeysFound: 0,
      row: 7,
    },

    initialize: function (options) {
    },

    foundKey: function () {
      this.set('numKeysFound', this.get('numKeysFound') + 1);
    },

    facingLeft: function () {
      return this.get('direction') === exports.globals.MAP_DIRECTION_LEFT;
    },

    facingRight: function () {
      return this.get('direction') === exports.globals.MAP_DIRECTION_RIGHT;
    },

    facingUp: function () {
      return this.get('direction') === exports.globals.MAP_DIRECTION_UP;
    },

    facingDown: function () {
      return this.get('direction') === exports.globals.MAP_DIRECTION_DOWN;
    },

  });

}());
