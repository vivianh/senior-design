(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: exports.globals.MAP_WIDTH,
      height: exports.globals.MAP_HEIGHT,
    },

    initialize: function (options) {
      this.set('config', this.defaultConfig());
    },

    defaultConfig: function () {
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width'));

      this.set('setup', this.mockSetupFile());

      return _.map(rows, function (row) {
        return _.map(cols, function (col) {
          var className = '';

          if (this.get('setup')[row]) {
            var symbol = this.get('setup')[row].charAt(col);
            if (symbol === exports.globals.CONFIG_SYMBOL_OBSTACLE) {
              className = 'isObstacle';
            } else if (symbol === exports.globals.CONFIG_SYMBOL_LOCK) {
              className = 'isLock';
            } else if (symbol === exports.globals.CONFIG_SYMBOL_KEY) {
              className = 'isKey';
            }
          }

          return {
            row: row,
            col: col,
            name: className,
          };
        }, this);
      }, this);
    },

    mockSetupFile: function () {
      var file = 'xxxoooxxxoooooo ' +
                 'KoooooooooooLoo ' +
                 'xoooooxooooxxox ';
      return file.split(' ');
    },

  });

}());
