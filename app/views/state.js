(function () {
  'use strict';

  exports.StateView = Backbone.View.extend({

    initialize: function (options) {
      this.template = _.template($('#state-template').html());
      this.listenTo(this.model, 'change', this.render);
    },

    render: function (params) {
      var compiledTemplate = this.template(
        _.extend(this.model.toJSON(), {
          'timeElapsed': this.time(this.model.get('timeElapsed')),
        })
      );
      this.$el.html(compiledTemplate);
    },

    time: function (elapsedTime) {
      var mins = Math.floor(elapsedTime / 60000);
      var secs = ((elapsedTime % 60000) / 1000).toFixed(0);
      return mins + ":" + (secs < 10 ? '0' : '') + secs;
    },

  });

}());
