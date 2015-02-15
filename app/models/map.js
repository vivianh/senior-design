(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: exports.globals.MAP_WIDTH,
      height: exports.globals.MAP_HEIGHT,
      numKeys: 0,
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
              this.set('numKeys', this.get('numKeys') + 1);
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

    hasObstacle: function (row, col) {
      return this.get('config')[row][col].name === 'isObstacle';
    },

    hasKey: function (row, col) {
      return this.get('config')[row][col].name === 'isKey';
    },

    removeKey: function (row, col) {
      var config = _.clone(this.get('config'));
      config[row][col].name = '';
      this.set('config', config);
      this.trigger('change');
    },

    hasLock: function (row, col) {
      return this.get('config')[row][col].name === 'isLock';
    },

    mockSetupFile: function () {
      var file = 'ooxoooxxxoooooo ' +
                 'xoooxxxxKoooLoo ' +
                 'oooooxxooooxxoo ' +
                 'oxxoooxoooxxKoo ' +
                 'oooooxxooooxxxo ' +
                 'xxxoooxxxooxooo ' +
                 'xKxooxxooooxxxo ' +
                 'xoooooxooooxxox ';
      return file.split(' ');
    },

  });

}());
