(function () {
  'use strict';

  exports.Player = Backbone.Model.extend({

    defaults: {
      row: 7,
      col: 5,
      numKeysFound: 0,
    },

    initialize: function (options) {
    },

    foundKey: function () {
      this.set('numKeysFound', this.get('numKeysFound') + 1);
    }

  });

}());
