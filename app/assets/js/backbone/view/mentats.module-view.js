
Mentats.DomainGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.domainRadius,

  initialize: function (options) {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.nodeEvents = {
      click: this.onNodeClick,
    };
  },

  onNodeClick: function (node, evt) {
    console.log('Mentats.DomainGraphView.onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewDomain(node.model.get('id'));
      evt.stopPropagation();
    }
  },

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
