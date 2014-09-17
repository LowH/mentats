
SVGG.Graph = Backbone.Model.extend({

  defaults: {
    nodes: [],
    links: []
  },

  initialize: function() {
    _.bindAll(this, 'link');
    var nodes = new this.nodesCollection(this.get('nodes'));
    var links = new this.linksCollection(this.get('links'));
    this.set({
      nodes: nodes,
      links: links
    });
    this.listenTo(nodes, 'remove', this.onRemove);
  },

  linksCollection: SVGG.LinksCollection,

  nodesCollection: Backbone.Collection,

  add: function (node) {
    this.get('nodes').add(node);
  },

  link: function(source, target) {
    var links = this.get('links');
    if (links.findWhere({source: source.cid, target: target.cid})) {
      console.log('already linked');
      return null;
    }
    var link = links.findWhere({source: target.cid, target: source.cid});
    if (link) {
      console.log('reverse link');
      links.remove(link);
    }
    link = new SVGG.Link({source: source.cid, target: target.cid});
    links.add(link);
    return link;
  },

  onRemove: function (node) {
    console.log('SVGG.Graph.onRemove', this, node);
    var links = this.get('links');
    links.remove(links.where({source: node.cid}));
    links.remove(links.where({target: node.cid}));
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

  remove: function (node) {
    this.get('nodes').remove(node);
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
  }

});
