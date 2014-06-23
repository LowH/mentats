
Mentats.ModuleView = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModuleView', this);
    this.domainsGraphView = new Mentats.DomainsGraphView({
      model: this.model.get('domains'),
      el: '#module-graph-view',
      width: 900,
      height: 602,
    });
  },

});
