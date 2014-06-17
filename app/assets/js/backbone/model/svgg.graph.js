
SVGG.Graph = Backbone.Model.extend({

  defaults: {
    nodes: [],
    links: []
  },

  initialize: function() {
    _.bindAll(this, 'link');
    var nodes = new Backbone.Collection(this.get('nodes'));
    var links = new Backbone.Collection(this.get('links'));
    this.set({
      nodes: nodes,
      links: links
    });
    this.listenTo(nodes, 'remove', this.onRemove);
  },

  add: function (node) {
    this.get('nodes').add(node);
  },

  link: function(source, target) {
    var links = this.get('links');
    var linked = links.where({source: source.cid, target: target.cid})[0];
    if (linked) {
      console.log('already linked:', linked);
      return null;
    }
    else {
      var link = new SVGG.Link({source: source.cid, target: target.cid});
      links.add(link);
      return link;
    }
  },

  onRemove: function (node) {
    var links = this.get('links');
    links.where({source: node.cid})
      .each(links.remove);
    links.where({target: node.cid})
      .each(links.remove);
  },

  parse: function(attr, options) {
    console.log('SVGG.Graph.parse', attr, options);
    var nodes = this.get('nodes');
    nodes.reset(attr.nodes);
    delete attr.nodes;
    _.each(attr.links, function(link) {
      link.source = nodes.findWhere({id: link.source}).cid;
      link.target = nodes.findWhere({id: link.target}).cid;
    });
    this.get('links').reset(attr.links);
    delete attr.links;
    return attr;
  },

  toJSON: function() {
    var nodes = this.get('nodes').models;
    var json = _.mapValues(this.attributes, function(x) {
      return (x.toJSON && typeof(x.toJSON) == 'function') ? x.toJSON() : x;
    });
    _.each(json.links, function(link) {
      link.source = _.findIndex(nodes, {cid: link.source});
      link.target = _.findIndex(nodes, {cid: link.target});
    });
    console.log('SVGG.Graph.toJSON', json);
    return json;
  },

});
