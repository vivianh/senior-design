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

    _aStar: function (goalTile) {
      var config = this.get('map').get('config');
      var startTile = config[this.get('row')][this.get('col')];
      startTile.parent = null;

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
          if (this._in(this.get('closedTiles'), neighbor)) {
            continue;
          }

          var lowestGScore = false;
          var gScore = currentTile.g + 1;

          if (!this._in(this.get('openTiles'), neighbor)) {
            lowestGScore = true;
            neighbor.h = this._heuristic(
              neighbor.row,
              neighbor.col,
              goalTile.row,
              goalTile.col
            );
            this.get('openTiles').push(neighbor);
          } else if (gScore < neighbor.g) {
            lowestGScore = true;
          }

          if (lowestGScore) {
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
    },

    detectPlayer: function (playerLocation) {
      var x = Math.abs(playerLocation.row - this.get('centerRow'));
      var y = Math.abs(playerLocation.col - this.get('centerCol'));
      if (x <= exports.globals.AI_THRESHOLD * 1.5 &&
          y <= exports.globals.AI_THRESHOLD * 1.5) {
        this.set('active', true);
        this._aStar(playerLocation);
      } else {
        this.set('active', false);
        this.loiter();
      }
    },

    loiter: function () {
      this.set('path', this._calculateLoiterPath());
    },

    _calculateLoiterPath: function () {
      var offset = exports.globals.AI_THRESHOLD;
      var startX = this.get('centerCol') - offset;
      var endX =   this.get('centerCol') + offset;
      var startY = this.get('centerRow') - offset;
      var endY =   this.get('centerRow') + offset;
      var steps = [];
      var nextStep = null;
      for (var x = 0; x < exports.globals.LOITER_PATH_OFFSET; x++) {
        var currentRow = nextStep ? nextStep.row : this.get('row');
        var currentCol = nextStep ? nextStep.col : this.get('col');
        nextStep = null;
        while (nextStep === null) {
          var random = Math.round(Math.random() * 4);
          if (random === 0) {
            var newRow = currentRow - 1;
            if (newRow >= 0 &&
                newRow >= startY &&
                newRow <= endY &&
                !this.get('map').hasObstacle(newRow, currentCol)) {
              nextStep = this.get('map').get('config')[newRow][currentCol];
            }
          } else if (random === 1) {
            var newRow = currentRow + 1;
            if (newRow < exports.globals.MAP_HEIGHT &&
                newRow >= startY &&
                newRow <= endY &&
                !this.get('map').hasObstacle(newRow, currentCol)) {
              nextStep = this.get('map').get('config')[newRow][currentCol];
            }
          } else if (random === 2) {
            var newCol = currentCol - 1;
            if (newCol >= 0 &&
                newCol >= startX &&
                newCol <= endX &&
                !this.get('map').hasObstacle(currentRow, newCol)) {
              nextStep = this.get('map').get('config')[currentRow][newCol];
            }
          } else if (random === 3) {
            var newCol = currentCol + 1;
            if (newCol < exports.globals.MAP_WIDTH &&
                newCol >= startX &&
                newCol <= endX &&
                !this.get('map').hasObstacle(currentRow, newCol)) {
              nextStep = this.get('map').get('config')[currentRow][newCol];
            }
          }
        }
        steps.push(nextStep);
      }
      return steps;
    },

  });

}());
