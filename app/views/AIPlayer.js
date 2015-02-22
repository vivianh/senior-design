(function () {
  'use strict';

  exports.AIPlayerView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#enemy-template').html());
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (params) {
      $('.enemy').remove();
      var compiledTemplate = this.template(this.model.toJSON());
      this.$el.append(compiledTemplate);
    },

  });

}());
