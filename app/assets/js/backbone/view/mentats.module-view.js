
Mentats.DomainGraphView = SVGG.Paper.extend({

  nodeRadius: 3,

});

Mentats.ModuleView = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModuleView', this);
    this.domainGraphView = new Mentats.DomainGraphView({
      model: this.model.get('domains'),
      el: '#module-graph-view',
      width: 900,
      height: 602,
    });
  },

});
