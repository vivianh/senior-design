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

      /*
      if (keyCode === 104) { // H, left
        newCol = currentCol - 1;
        if (newCol >= 0 &&
            !exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          this.model.set({'col': newCol});
        }
      } else if (keyCode === 106) { // J, down
      */
      if (keyCode === 106) { // J, down
        newRow = currentRow + 1;
        if (newRow < exports.globals.MAP_HEIGHT &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          this.model.set({'row': newRow});
        }
      } else if (keyCode === 107) { // K, up
        newRow = currentRow - 1;
        if (newRow >= 0 &&
            !exports.map.hasObstacle(newRow, currentCol)) {
          this._checkLockAndKey(newRow, currentCol);
          this.model.set({'row': newRow});
        }
      } else if (keyCode === 108) { // L, right
        newCol = currentCol + 1;
        if (newCol < exports.globals.MAP_WIDTH &&
            !exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          this.model.set({'col': newCol});
        }
      }

      var margin = exports.globals.MAP_WIDTH - this.model.get('col');
      if (margin <= exports.globals.MARGIN) {
        exports.map.updateConfig(margin);
      }

      exports.enemy._aStar(null, {'row': newRow, 'col': newCol});
    },

    _checkLockAndKey: function (row, col) {
      if (exports.map.hasKey(row, col)) {
        this.model.foundKey();
        exports.map.removeKey(row, col);
      } else if (exports.map.hasLock(row, col) &&
                 this.numKeysFound === exports.map.numKeys) {
        console.log('NEXT LEVEL');
      }
    },

    render: function (params) {
      $('.player').remove();
      var compiledTemplate = this.template(this.model.toJSON());
      this.$el.append(compiledTemplate);
    },

  });

}());
