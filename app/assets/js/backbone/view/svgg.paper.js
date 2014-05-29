
SVGG.Paper = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.grid = options.grid || 8;
    this.svg = SVG(this.$el.find('.paper')[0])
      .fixSubPixelOffset()
      .size(options.width, options.height);
  }

})
