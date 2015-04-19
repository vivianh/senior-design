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
      var newRow = 0;
      var newCol = 0;

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
        newCol = currentCol - 1;
        // if (newCol >= this.model.get('margin') &&
        if (!exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          var margin =
            this.model.get('margin') <= 0 ? 0 : this.model.get('margin') - 1;
          this.model.set({
            'col': newCol,
            'margin': margin,
            'direction': exports.globals.MAP_DIRECTION_LEFT,
          });
          exports.map.setMargin(false);
        }
      } else if (keyCode === 106) { // J, down
        newRow = currentRow + 1;
        if (newRow < exports.globals.MAP_HEIGHT &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          this.model.set({
            'row': newRow,
            'direction': exports.globals.MAP_DIRECTION_DOWN,
          });
        }
      } else if (keyCode === 107) { // K, up
        newRow = currentRow - 1;
        if (newRow >= 0 &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          this.model.set({
            'row': newRow,
            'direction': exports.globals.MAP_DIRECTION_UP,
          });
        }
      } else if (keyCode === 108) { // L, right
        newCol = currentCol + 1;
        if (!exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          this.model.set({
            'col': newCol,
            'margin': this.model.get('margin') + 1,
            'direction': exports.globals.MAP_DIRECTION_RIGHT,
          });
          exports.map.setMargin(true);
        }
      }

      for (var i = 0; i < exports.enemies.length; i++) {
        // exports.enemies[i]._aStar(null, {'row': newRow, 'col': newCol}, i);
        exports.enemies[i].detectPlayer({'row': newRow, 'col': newCol}, i);
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
