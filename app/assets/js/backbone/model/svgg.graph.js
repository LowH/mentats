
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
    var linked = links.where({source: source.id, target: target.id})[0];
    if (linked) {
      console.log('already linked:', linked);
      return null;
    }
    else {
      var link = new SVGG.Link({source: source.id, target: target.id});
      links.add(link);
      return link;
    }
  },

});
