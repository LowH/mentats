
SVGG.Paper = Backbone.View.extend({

  initialize: function (options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.grid = options.grid || 8;
    this.nodeRadius = options.nodeRadius || 3;
    this.paperDiv = this.$el.find('.paper')[0];
    this.paperDiv.offset = $(this.paperDiv).offset();
    this.svg = SVG(this.paperDiv)
      .fixSubPixelOffset()
      .size(options.width, options.height);
    this.svgLinks = this.svg.group();
    this.svgNodes = this.svg.group().front();
  }

});
