(function () {
  'use strict';

  exports.AIPlayer = Backbone.Model.extend({
    defaults: {
      goalRow: 4,
      goalCol: 4,
      /* set of tiles that have been searched */
      closedTiles: [],
      /* set of tiles that have not been fully searched */
      openTiles: [],
    },

    // the Map should create the AIPlayer objects and pass in row/col
    initialize: function (options) {
    },

    // Manhattan distance
    _aStarHeuristic: function (row0, col0, row1, col1) {
      var d1 = Math.abs(row1 - row0);
      var d2 = Math.abs(col1 - col0);
      return d1 + d2;
    },

    aStar: function () {
      var config = this.map.get('config');
      var startTile = config[this.get('row')][this.get('col')];
      this.set('openTiles', [startTile]);

      while (this.get('openTiles').length > 0) {
        var lowest = 0;
        for (var i = 0; i < this.get('openTiles').length; i++) {
          if (this.get('openTiles')[i].f < this.get('openTiles')[lowest].f) {
            lowest = i;
          }
        }
        var currentTile = this.get('openTiles')[lowest];

        // return path !!
        if (currentTile.row === this.get('goalRow') &&
            currentTile.col === this.get('goalCol')) {
            var curr = currentTile;
            var ret = [];

            while (curr.parent) {
              ret.push(curr);
              curr = curr.parent;
            }
            return ret.reverse();
        }

        this.get('openTiles').splice(lowest, 1);
        this.get('closedTiles').push(currentTile);
        var neighbors = this.map.getNeighbors(currentTile.row, currentTile.col);

        for (var j = 0; j < neighbors.length; j++) {
          var neighbor = neighbors[j];
          var gScore = currentTile.g + 1;
          var highestGScore = false;

          if (this._alreadySeen(this.get('closedTiles'), neighbor)) {
            continue;
          }

          if (!this._alreadySeen(this.get('openTiles'), neighbor)) {
            highestGScore = true;
            neighbor.h = this._aStarHeuristic(
              neighbor.row,
              neighbor.col,
              this.get('goalRow'),
              this.get('goalCol')
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
    },

    _alreadySeen: function (list, tile) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].row === tile.row &&
            list[i].col === tile.col) {
              return true;
        }
      }

      return false;
    },

  });

}());
