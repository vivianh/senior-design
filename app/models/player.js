(function () {
  'use strict';

  exports.Player = Backbone.Model.extend({

    defaults: {
      xc: 0,
      yc: 0,
      direction: 'right',
    },

    initialize: function (options) {
    },

  });

}());
