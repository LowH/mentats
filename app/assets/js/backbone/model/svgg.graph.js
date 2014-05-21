
SVGG.Graph = Backbone.Model.extend({

  initialize: function() {
    _.bindAll(this, 'onAddNode', 'onAddLink');
    var nodes = new Backbone.Collection;
    nodes.on('add', this.onAddNode);
    this.set('nodes', nodes);
    var links = new Backbone.Collection;
    links.on('add', this.onAddLink);
    this.set('links', links);
  },

  addNode: function(node) {
    this.get('nodes').add(node);
  },

  onAddNode: function(node) {
    console.log('graph on add node', this);
    this.trigger('addNode', node);
  },

  addLink: function(source, target) {
    var links = this.get('links');
    if (links.where({'source': source, 'target': target}))
      console.log('already linked:', source, target);
    else
      links.add(node);
  },

  onAddLink: function(link) {
    console.log('graph on add link');
    this.trigger('addLink', link);
  }

});
