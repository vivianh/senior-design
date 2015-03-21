(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: exports.globals.MAP_WIDTH,
      height: exports.globals.MAP_HEIGHT,
      numKeys: 0,
    },

    initialize: function (options) {
      this.set('defaultConfig', this.defaultConfig());
      this.set('config', this.get('defaultConfig'));

      exports.enemy = new exports.AIPlayer({
        row: 2,
        col: 2,
        goalRow: this.get('goalRow'),
        goalCol: this.get('goalCol'),
        map: this,
      });

      exports.enemyView = new exports.AIPlayerView({
        model: exports.enemy,
        el: '#canvas',
      });
      exports.enemyView.render();
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
              this.set('goalRow', row);
              this.set('goalCol', col);
            } else if (symbol === exports.globals.CONFIG_SYMBOL_KEY) {
              className = 'isKey';
              this.set('numKeys', this.get('numKeys') + 1);
            }
          }

          return {
            row: row,
            col: col,
            name: className,
            iteration: 0,
            expanded: false,
            parent: null,
          };
        }, this);
      }, this);
    },

    updateConfig: function (margin) {
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width') - margin, this.get('width'));
      var config = this._shiftConfig(margin);

      _.map(rows, function (row) {
        _.map(cols, function (col) {
          var className;
          if (this.hasObstacle(row, col - 1)) {
            className = 'isObstacle';
          }

          config[row][col] = {
            row: row,
            col: col,
            name: className,
            parent: null,
          }
        }, this, config);
      }, this, config);
      this.set('config', config);
    },

    _shiftConfig: function (margin) {
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width') - margin);
      var config = this.get('config');

      return _.map(rows, function (row) {
        return _.map(cols, function (col) {
          return config[row][col + margin];
        }, config, margin);
      }, config, margin);
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
