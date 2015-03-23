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

      if (keyCode === 104) { // H, left
        newCol = currentCol - 1;
        if (newCol >= 0 &&
            !exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          this.model.set({'col': newCol});
        }
      } else if (keyCode === 106) { // J, down
      // if (keyCode === 106) { // J, down
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
        if (!exports.map.hasObstacle(currentRow, newCol)) {
          this._checkLockAndKey(currentRow, newCol);
          this.model.set({
            'col': newCol,
            'margin': this.model.get('margin') + 1,
          });
          exports.map.setMargin();
        }
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
