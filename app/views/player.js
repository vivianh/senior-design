(function () {
  'use strict';

  exports.PlayerView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#player-template').html());
    },

    render: function (params) {
      var compiledTemplate = this.template(this.model.toJSON());
      this.$el.append(compiledTemplate);
    },

  });

}());
