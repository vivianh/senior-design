(function () {
  'use strict';

  exports.PlayerView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#player-template').html());
      this.listenTo(this.model, 'change', this.render);
      _.bindAll(this, 'onKeyPress');
      $(document).bind('keypress', this.onKeyPress);
    },

    onKeyPress: function (e) {
      var keyCode = e.keyCode;
      var currentRow = this.model.get('row');
      var currentCol = this.model.get('col');
      var newRow = currentRow;
      var newCol = currentCol;

      if (keyCode === 120) { // x, clear blockade!
        if (this.model.facingLeft()) {
          newCol = currentCol - 1;
          if (exports.map.hasObstacle(currentRow, newCol)) {
            exports.map.removeObstacle(currentRow, newCol);
          }
        } else if (this.model.facingRight()) {
          newCol = currentCol + 1;
          if (exports.map.hasObstacle(currentRow, newCol)) {
            exports.map.removeObstacle(currentRow, newCol);
          }
        } else if (this.model.facingUp()) {
          newRow = currentRow - 1;
          if (exports.map.hasObstacle(newRow, currentCol)) {
            exports.map.removeObstacle(newRow, currentCol);
          }
        } else if (this.model.facingDown()) {
          newRow = currentRow + 1;
          if (exports.map.hasObstacle(newRow, currentCol)) {
            exports.map.removeObstacle(newRow, currentCol);
          }
        }
        return;
      }

      if (keyCode === 104) { // H, left
        var options = {
          'direction': exports.globals.MAP_DIRECTION_LEFT,
        };
        newCol = currentCol - 1;
        if (!exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          var margin =
            this.model.get('margin') <= 0 ? 0 : this.model.get('margin') - 1;
          _.extend(options, {
            'col': newCol,
            'margin': margin,
          });
          exports.map.setMargin(false);
        }
        this.model.set(options);
      } else if (keyCode === 106) { // J, down
        var options = {
          'direction': exports.globals.MAP_DIRECTION_DOWN,
        };
        newRow = currentRow + 1;
        if (newRow < exports.globals.MAP_HEIGHT &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          _.extend(options, {
            'row': newRow,
          });
        }
        this.model.set(options);
      } else if (keyCode === 107) { // K, up
        var options = {
          'direction': exports.globals.MAP_DIRECTION_UP,
        };
        newRow = currentRow - 1;
        if (newRow >= 0 &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          _.extend(options, {
            'row': newRow,
          });
        }
        this.model.set(options);
      } else if (keyCode === 108) { // L, right
        var options = {
          'direction': exports.globals.MAP_DIRECTION_RIGHT,
        };
        newCol = currentCol + 1;
        if (!exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          _.extend(options, {
            'col': newCol,
            'margin': this.model.get('margin') + 1,
          });
          exports.map.setMargin(true);
        }
        this.model.set(options);
      }

      for (var i = 0; i < exports.enemies.length; i++) {
        exports.enemies[i].detectPlayer({'row': newRow, 'col': newCol});
      }
    },

    _checkLockAndKey: function (row, col) {
      if (exports.map.hasKey(row, col)) {
        this.model.foundKey();
        if (exports.map.removeKey(row, col)) {
          exports.state.incrementScore();
        }
      } else if (exports.map.hasLock(row, col) &&
                 this.numKeysFound === exports.map.numKeys) {
        console.log('NEXT LEVEL');
      }
    },

    render: function (params) {
      $('.player').remove();
      var compiledTemplate = this.template(
        _.extend(
          this.model.toJSON(),
          {'col': this.model.get('col') - this.model.get('margin')}
        )
      );
      this.$el.append(compiledTemplate);
    },

  });

}());
