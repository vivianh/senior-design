(function () {
  'use strict';

  exports.Map = Backbone.Model.extend({

    defaults: {
      width: exports.globals.MAP_WIDTH,
      height: exports.globals.MAP_HEIGHT,
      numKeys: 0,
      margin: 0,
      maxMargin: 0,
      config: [],
      nextConfig: [],
    },

    initialize: function (options) {
      this.set('defaultConfig', this.defaultConfig());
      this.set('config', this.get('defaultConfig'));
      this.set('nextConfig', this._augmentConfig());

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
        }
        if (this.get('config')[0].length <
            this.get('width') + this.get('margin')) {
          this.set('config', this._updateConfig());
          this.set('nextConfig', this._augmentConfig());
        }
      } else {
        newMargin = newMargin <= 0 ? 0 : newMargin - 1;
        this.set('margin', newMargin);
      }
    },

    /** for debugging **/
    _printConfig: function (config) {
      for (var x = 0; x < config.length; x++) {
        var row = '';
        for (var y = 0; y < config[0].length; y++) {
          if (config[x][y].name === 'isObstacle') {
            row += 'x';
          } else if (config[x][y].name === 'isEmpty') {
            row += 'o';
          } else if (config[x][y].name === 'isRoom') {
            row += 'z';
          } else if (config[x][y].name === 'isConnector') {
            row += '=';
          } else {
            row += '?';
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
            } else {
              className = 'isEmpty';
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
      var rows = this.get('height');
      var configWidth = this.get('config')[0].length;
      var updatedConfig = _.clone(this.get('config'));

      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < this.get('nextConfig')[0].length; c++) {
          updatedConfig[r][configWidth + c] = {
            row: r,
            col: configWidth + c,
            name: this.get('nextConfig')[r][c].name,
          };
        }
      }

      return updatedConfig;
    },

    _augmentConfig: function () {
      var height = this.get('height');
      var augmentWidth = 11;

      /* create 2-d array of tiles */
      /* isObstacle is default tile state */
      var augment = _.map(_.range(height), function (r) {
          return _.map(_.range(augmentWidth), function (c) {
            if (c === 0) {
              var len = this.get('config')[0].length - 1;
              return this.get('config')[r][len];
            } else {
              return {
                row: r,
                col: c,
                name: 'isObstacle',
              };
            }
          }, this);
        }, this);

      /* set 2x2 'open/empty tiles' */
      for (var x = 0; x < 30; x ++) {
        var randomRow = Math.round(Math.random() * (height - 2));
        var randomCol = Math.round(Math.random() * (augmentWidth - 2));
        if (this._isDefault(augment, randomRow, randomCol)) {
          augment = this._setRoom(augment, randomRow, randomCol);
        }
      }

      augment = this._connectRooms(this._DFS(augment));

      /* remove the first column copied from current config */
      for (var r = 0; r < augment.length; r++) {
        augment[r].shift();
      }

      return augment;
    },

    /* pseudo DFS */
    _DFS: function (config) {
      for (var r = 0; r < config.length; r++) {
        for (var c = 0; c < config[0].length; c++) {
          if (config[r][c].name !== 'isRoom') {
            if (config[r][c - 1] && config[r][c - 1].name === 'isRoom') continue;
            if (config[r][c + 1] && config[r][c + 1].name === 'isRoom') continue;
            if (config[r + 1] && config[r + 1][c].name === 'isRoom') continue;
            if (config[r - 1] && config[r - 1][c].name === 'isRoom') continue;
            if (config[r + 1] && config[r + 1][c + 1] &&
                config[r + 1][c + 1].name === 'isRoom') continue;
            if (config[r + 1] && config[r + 1][c - 1] &&
                config[r + 1][c - 1].name === 'isRoom') continue;
            if (config[r - 1] && config[r - 1][c + 1] &&
                config[r - 1][c + 1].name === 'isRoom') continue;
            if (config[r - 1] && config[r - 1][c - 1] &&
                config[r - 1][c - 1].name === 'isRoom') continue;
            config[r][c].name = 'isEmpty'
          }
        }
      }
      return config;
    },

    _isDefault: function (config, row, col) {
      return config[row][col].name === 'isObstacle' &&
             config[row + 1][col].name === 'isObstacle' &&
             config[row][col + 1].name === 'isObstacle' &&
             config[row + 1][col + 1].name === 'isObstacle';
    },

    _setRoom: function (config, row, col) {
      config[row][col].name = 'isRoom';
      config[row + 1][col].name = 'isRoom';
      config[row][col + 1].name = 'isRoom';
      config[row + 1][col + 1].name = 'isRoom';
      return config;
    },

    /** connect Rooms & psuedo DFS maze **/
    _connectRooms: function (config) {
      for (var r = 0; r < config.length; r++) {
        for (var c = 0; c < config[0].length; c++) {
          if (config[r][c].name === 'isObstacle') {
            if (config[r][c - 1] && config[r][c + 1] &&
                this._canConnect(config[r][c - 1], config[r][c + 1])) {
              config[r][c].name = 'isConnector';
            } else if (config[r + 1] && config[r - 1] &&
                       this._canConnect(config[r + 1][c], config[r - 1][c])) {
              config[r][c].name = 'isConnector';
            }
          }
        }
      }
      return config;
    },

    _canConnect: function (tile1, tile2) {
      /*
      return (tile1.name === 'isRoom' || tile1.name === 'isEmpty') &&
             (tile2.name === 'isRoom' || tile2.name === 'isEmpty');
      */
      return (tile1.name === 'isRoom' && tile2.name === 'isEmpty') ||
             (tile1.name === 'isEmpty' && tile2.name === 'isRoom');
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
