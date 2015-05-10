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

  log: debug.logger('SVGG.Graph'),
  
  add: function (node) {
    this.get('nodes').add(node);
  },

  findLink: function (source, target) {
    return this.get('links').find(function (link) {
      var linkSource = link.get('source');
      var linkTarget = link.get('target');
      return ((linkSource === source.id || linkSource === source.cid) &&
              (linkTarget === target.id || linkTarget === target.cid));
    });
  },

  link: function(source, target) {
    var links = this.get('links');
    if (this.findLink(source, target)) {
      this.log('already linked');
      return null;
    }
    var link = this.findLink(target, source);
    if (link) {
      this.log('reverse link');
      links.remove(link);
    }
    link = new SVGG.Link({source: source.id, target: target.id});
    links.add(link);
    return link;
  },

  onRemove: function (node) {
    this.log('onRemove', this, node);
    var links = this.get('links');
    var pos = this.get('nodes').indexOf(node);
    links.remove(links.where({source: pos}));
    links.remove(links.where({target: pos}));
  },

  remove: function (node) {
    this.get('nodes').remove(node);
  },

  rootNodes: function () {
    var links = this.attributes.links;
    return _.reject(this.attributes.nodes, function (node) {
      return _.find(links, { target: node });
    }, this);
  },

  successors: function (node) {
    if (_.isObject(node))
      node = node.id;
    var succ = [];
    _.each(this.attributes.links, function (link) {
      if (link.source == node && !_.find(succ, link.target))
        succ.push(link.target);
    });
    return succ;
  }

});
