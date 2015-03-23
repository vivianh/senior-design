(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: exports.globals.MAP_WIDTH,
      height: exports.globals.MAP_HEIGHT,
      numKeys: 0,
      margin: 0,
      maxMargin: 0,
    },

    initialize: function (options) {
      this.set('defaultConfig', this.defaultConfig());
      this.set('config', this.get('defaultConfig'));
      // this._printConfig();

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

    setMargin: function (incMargin) {
      var newMargin = this.get('margin');
      if (incMargin) {
        newMargin = newMargin + 1;
        this.set('margin', newMargin);
        if (newMargin > this.get('maxMargin')) {
          this.set('maxMargin', newMargin);
          this.set('config', this._updateConfig());
        }
      } else {
        newMargin = newMargin <= 0 ? 0 : newMargin - 1;
        this.set('margin', newMargin);
      }
    },

    /** for debugging **/
    _printConfig: function () {
      var margin = this.get('margin');
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width') + margin);
      for (var x = 0; x < this.get('height'); x++) {
        var row = '';
        for (var y = margin; y < this.get('width') + margin; y++) {
          if (this.get('config')[x][y].name === 'isObstacle') {
            row += 'x';
          } else {
            row += 'o';
          }
        }
        console.log(row);
      }
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

    _updateConfig: function () {
      var rows = _.range(this.get('height'));
      var cols = _.range(this.get('width') + this.get('margin'));

      return _.map(rows, function (row) {
        return _.map(cols, function (col) {
          if (this.get('config')[row][col]) {
            return this.get('config')[row][col];
          } else {
            var className;
            var random = Math.round(Math.random());
            if (random === 0) {
              className = 'isObstacle';
            }

            return {
              row: row,
              col: col,
              name: className,
              parent: null,
            };
          }
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
