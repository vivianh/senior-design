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

      var enemy = new exports.AIPlayer({
        row: 2,
        col: 2,
      });
      enemy.map = this;

      var enemyView = new exports.AIPlayerView({
        model: enemy,
        el: '#canvas',
      });
      enemyView.render();
      enemy.aStar();

      // this.set('enemy', enemy);
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
            f: 0,
            g: 0,
            h: 0,
            parent: undefined,
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

    getNeighbors: function (row, col) {
      var neighbors = [];
      if (this.get('config')[row - 1] &&
          !this.hasObstacle(row - 1, col)) {
        neighbors.push(this.get('config')[row - 1][col]);
      }
      if (this.get('config')[row][col - 1] &&
          !this.hasObstacle(row, col - 1)) {
        neighbors.push(this.get('config')[row][col - 1]);
      }
      if (this.get('config')[row + 1] &&
          !this.hasObstacle(row + 1, col)) {
        neighbors.push(this.get('config')[row + 1][col]);
      }
      if (this.get('config')[row][col + 1] &&
          !this.hasObstacle(row, col + 1)) {
        neighbors.push(this.get('config')[row][col + 1]);
      }
      return neighbors;
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
