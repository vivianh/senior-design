(function () {
  'use strict';

  exports.MapView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#map-template').html());
    },

    render: function (params) {
      var compiledTemplate = this.template({
        'squares': this.model.toJSON()['config']
      });
      this.$el.html(compiledTemplate);
    },

  });

}());
