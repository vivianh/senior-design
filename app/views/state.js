(function () {
  'use strict';

  exports.StateView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#state-template').html());
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (params) {
      var compiledTemplate = this.template(this.model.toJSON());
      this.$el.html(compiledTemplate);
    },

  });

}());
