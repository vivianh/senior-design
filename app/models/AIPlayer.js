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

    // lower = better
    _newHeuristic: function (row0, col0, row1, col1, direction) {
      var d1 = Math.abs(row1 - row0);
      var d2 = Math.abs(col1 - col0);
      var diff = col1 - col0;
      var weight = 1;
      if (direction === exports.globals.AI_TARGET_RIGHT && (diff > 0) ||
          direction === exports.globals.AI_TARGET_LEFT && (diff < 0)) {
        weight = 0.5;
      }
      console.log(d1 + d2, (d1 + d2) * weight);
      return (d1 + d2) * weight;
    },

    _aStar: function (goalTile, targetDirection) {
      var config = this.get('map').get('config');
      var startTile = config[this.get('row')][this.get('col')];
      startTile.parent = null;

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
          if (this._in(this.get('closedTiles'), neighbor)) {
            continue;
          }

          var lowestGScore = false;
          var gScore = currentTile.g + 1;

          if (!this._in(this.get('openTiles'), neighbor)) {
            lowestGScore = true;
            neighbor.h = this._newHeuristic(
              neighbor.row,
              neighbor.col,
              goalTile.row,
              goalTile.col,
              targetDirection
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
      var x = Math.abs(playerLocation.row - this.get('row'));
      var y = Math.abs(playerLocation.col - this.get('col'));
      if (x <= exports.globals.AI_THRESHOLD &&
          y <= exports.globals.AI_THRESHOLD) {
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
      var config = this.get('map').get('config');
      var offset = exports.globals.AI_THRESHOLD / 2;
      var startX = this.get('col') - offset;
      var endX =   this.get('col') + offset;
      var startY = this.get('row') - offset;
      var endY =   this.get('row') + offset;
      var steps = _.range(exports.globals.LOITER_PATH_OFFSET);
      return _.map(steps, function (step) {
        var valid = false;
        var nextStep = null;
        while (nextStep === null) {
          var random = Math.round(Math.random() * 4);
          if (random === 0) { // up
            nextStep = config[this.get('row') + 1][this.get('col')];
          } else if (random === 1) {
            nextStep = config[this.get('row')][this.get('col') + 1];
          } else if (random === 2) {
            nextStep = config[this.get('row') - 1][this.get('col')];
          } else if (random === 3) {
            nextStep = config[this.get('row')][this.get('col') - 1];
          }
        }
        return nextStep;
      }, this);
    },

  });

}());
