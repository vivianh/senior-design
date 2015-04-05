(function () {
  'use strict';

  exports.AIPlayerView = Backbone.View.extend({

    defaults: {
      firstRender: true,
    },

    initialize: function (options) {
      this.options = _.extend(this.defaults, this.options);
      this.template = _.template($('#enemy-template').html());
      this.listenTo(this.model, 'change', this.render);
      setInterval(_.bind(this._move, this), 250);
    },

    render: function (params) {
      if (this.options.firstRender) {
        this.options.firstRender = false;
        this.model._aStar();
      }
      $('.enemy').remove();
      var margin = exports.map ? exports.map.get('margin') : 0;
      if (this.model.get('col') > margin) {
        var compiledTemplate = this.template(
          _.extend(this.model.toJSON(), {'col': this.model.get('col') - margin})
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
      } else {
        clearInterval();
      }
    },

  });

}());
