(function () {
  'use strict';

  exports.MapView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#map-template').html());
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (params) {
      var compiledTemplate = this.template({
        'squares': this.model.toJSON()['config'],
        'margin': this.model.get('margin'),
      });
      this.$el.html(compiledTemplate);
    },

  });

}());
