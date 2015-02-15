(function () {
  'use strict';

  exports.Player = Backbone.Model.extend({

    defaults: {
      row: 0,
      col: 0,
      numKeysFound: 0,
    },

    initialize: function (options) {
    },

    foundKey: function () {
      this.set('numKeysFound', this.get('numKeysFound') + 1);
    }

  });

}());
