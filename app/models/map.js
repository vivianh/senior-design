(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: 15,
      height: 10,
    },

    initialize: function (options) {
      this.set('config', this.defaultConfig());
    },

    defaultConfig: function () {
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width'));

      return _.map(rows, function (row) {
        return _.map(cols, function (col) {
          return {
            row: row,
            col: col,
            name: 'grass',
          };
        });
      });
    },

  });

}());
