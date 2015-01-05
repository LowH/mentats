/*
 *  SVGG Graph base class
 *  Attributes :
 *    -  nodes: a collection of SVGG.Node or a subtype.
 *    -  links: a collection of SVGG.Link or a subtype.
 */

SVGG.Graph = Backbone.RelationalModel.extend({

  defaults: {
    nodes: [],
    links: []
  },

  initialize: function() {
    _.bindAll(this, 'link');
    Backbone.RelationalModel.prototype.initialize.apply(this, arguments);
    this.hasMany('nodes', this.nodeModel, {
      init: function (nodes) {
        this.listenTo(nodes, 'remove', this.onRemove);
      }
    });
    this.hasCollection('links', this.linksCollection);
  },

  linksCollection: SVGG.LinksCollection,

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
    var pos = this.get('nodes').indexOf(node);
    links.remove(links.where({source: pos}));
    links.remove(links.where({target: pos}));
  },

  parse: function (attrs) {
    this.get('links').set(attrs.links);
    delete attrs.links;
    return attrs;
  },

  remove: function (node) {
    this.get('nodes').remove(node);
  }

});
