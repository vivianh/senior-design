(function () {
  'use strict';

  exports.AIPlayerView = Backbone.View.extend({

    initialize: function (options) {
      this.options = options;
      this.options.firstRender = true;
      this.template = _.template($('#enemy-template').html());
      this.listenTo(this.model, 'change', this.render);
      this.options.intervalId = setInterval(_.bind(this._move, this), 250);
    },

    render: function (params) {
      if (this.options.firstRender) {
        this.options.firstRender = false;
        this.model._aStar();
      }
      var className = '.' + (this.options.className);
      $(className).remove();
      var margin = exports.map ? exports.map.get('margin') : 0;
      if (this.model.get('col') > margin) {
        var compiledTemplate = this.template(
          _.extend(this.model.toJSON(), {
            'col': this.model.get('col') - margin,
            'className': this.options.className,
          })
        );
      }
      this.$el.append(compiledTemplate);
    },

    _move: function () {
      if (this.model.get('path').length > 0) {
        var nextTile = this.model.get('path').shift();
        this.model.set({
          'row': nextTile.row,
          'col': nextTile.col,
        });
        if (this.model.get('path').length === 1 && !this.model.get('active')) {
          this.model.loiter();
        }
      } else {
        exports.state.endGame();
        clearInterval(this.options.intervalId);
      }
    },

  });

}());
