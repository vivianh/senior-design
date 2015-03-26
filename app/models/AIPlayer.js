(function () {
  'use strict';

  exports.AIPlayer = Backbone.Model.extend({
    defaults: {
      row: 0,
      col: 0,
      deletedTiles: [],
      /* set of tiles that have been searched */
      closedTiles: [],
      /* set of tiles that have not been fully searched */
      openTiles: [],
      /* set of tiles to take! */
      path: [],
    },

    // the Map should create the AIPlayer objects and pass in row/col
    initialize: function (options) {
    },

    // Manhattan distance
    _heuristic: function (row0, col0, row1, col1) {
      var d1 = Math.abs(row1 - row0);
      var d2 = Math.abs(col1 - col0);
      return d1 + d2;
    },

    _aStar: function (startTile, goalTile) {
      var config = this.get('map').get('config');
      if (!startTile) {
        startTile = config[this.get('row')][this.get('col')];
        startTile.parent = null;
      }
      if (!goalTile) {
        goalTile = {
          row: this.get('goalRow'),
          col: this.get('goalCol'),
        };
      }
      this.set('openTiles', [startTile]);
      this.set('closedTiles', []);

      while (this.get('openTiles').length > 0) {
        var lowest = 0;
        for (var i = 0; i < this.get('openTiles').length; i++) {
          if (this.get('openTiles')[i].f < this.get('openTiles')[lowest].f) {
            lowest = i;
          }
        }
        var currentTile = this.get('openTiles')[lowest];

        this.get('openTiles').splice(lowest, 1);
        this.get('closedTiles').push(currentTile);

        // return path !!
        if (currentTile.row === exports.player.get('row') &&
            currentTile.col === exports.player.get('col')) {
            var curr = _.clone(currentTile);
            var ret = [];

            while (curr.parent) {
              ret.push(curr);
              curr = curr.parent;
            }
            this.set('path', ret.reverse());
            return true;
        }

        var neighbors = this.get('map')
                            .getNeighbors(currentTile.row, currentTile.col);

        for (var j = 0; j < neighbors.length; j++) {
          var neighbor = neighbors[j];
          var gScore = currentTile.g + 1;
          var highestGScore = false;

          if (this._in(this.get('closedTiles'), neighbor)) {
            continue;
          }

          if (!this._in(this.get('openTiles'), neighbor)) {
            highestGScore = true;
            neighbor.h = this._heuristic(
              neighbor.row,
              neighbor.col,
              goalTile.row,
              goalTile.col
            );
            this.get('openTiles').push(neighbor);
          } else if (gScore < neighbor.g) {
            highestGScore = true;
          }

          if (highestGScore) {
            neighbor.parent = currentTile;
            neighbor.g = gScore;
            neighbor.f = neighbor.g + neighbor.h;
          }
        }
      }
      return false;
    },

    _in: function (list, tile) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].row === tile.row &&
            list[i].col === tile.col) {
              return true;
        }
      }

      return false;
    },

    /* for tile objects */
    _isEqual: function (x, y) {
      return x.row === y.row && x.col === y.col;
    },

    _remove: function (list, tile) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].row === tile.row && list[i].col === tile.col) {
          list.slice(i, 1);
          return;
        }
      }
    }

  });

}());
