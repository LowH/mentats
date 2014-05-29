
Mentats.Module = Backbone.Model.extend({

  defaults: {
    discipline: "",
    level: "",
    version: 0,
    owner: null,
    description: "",
    domains: []
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.set({
      domains: new SVGG.Graph(this.get('domains'))
    });
  }

});
