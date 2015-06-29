
Mentats.GraphView = SVGG.Paper.extend({

  initialize: function (options) {
    debug.log('Mentats.GraphView', 'new', options);
    this.nodeEvents = {
      click: options.onNodeClick || this.onNodeClick
    };
    SVGG.Paper.prototype.initialize.apply(this, arguments);
  }

});
