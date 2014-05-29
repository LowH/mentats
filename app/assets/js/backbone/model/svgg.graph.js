
SVGG.Graph = Backbone.Model.extend({

  defaults: {
    nodes: [],
    links: []
  },

  initialize: function() {
    _.bindAll(this, 'link');
    this.set({
      nodes: new Backbone.Collection(this.get('nodes')),
      links: new Backbone.Collection(this.get('links'))
    });
  },

  add: function (node) {
    this.get('nodes').add(node);
  },
  
  link: function(source, target) {
    var links = this.get('links');
    if (links.where({source: source.id, target: target.id}))
      console.log('already linked:', source, target);
    else
      links.add(new SVGG.Link({source: source.id, target: target.id}));
  },

});
