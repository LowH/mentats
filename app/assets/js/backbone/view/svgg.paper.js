
SVGG.Paper = Backbone.View.extend({

  initialize: function (options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onAddNode', 'onAddLink');

    this.width = options.width;
    this.height = options.height;

    this.grid = options.grid || 8;
    this.$paper = this.$el.find('.paper');
    if (!this.$paper.length)
      this.$paper = $('<div class="paper"></div>').appendTo(this.$el);
    this.svg = SVG(this.$paper[0])
      .fixSubPixelOffset()
      .size(options.width, options.height);
    this.svgLinks = this.svg.group();
    this.svgNodes = this.svg.group().front();

    var nodes = this.model.get('nodes');
    this.nodeViews = [];
    nodes.each(this.onAddNode);
    this.listenTo(nodes, 'add', this.onAddNode);
    this.listenTo(nodes, 'remove', this.onRemoveNode);
    this.listenTo(nodes, 'reset', this.onResetNodes);

    var links = this.model.get('links');
    this.linkViews = [];
    links.each(this.onAddLink);
    this.listenTo(links, 'add', this.onAddLink);
    this.listenTo(links, 'remove', this.onRemoveLink);
    this.listenTo(links, 'reset', this.onResetLinks);
  },

  linkEvents: {},

  mousePosition: function (evt) {
    var offset = this.$paper.offset();
    var p = {
      x: evt.pageX - offset.left,
      y: evt.pageY - offset.top,
    };
    p.x = Math.round(p.x / this.grid) * this.grid;
    p.y = Math.round(p.y / this.grid) * this.grid;
    if (p.x > this.svg.width() - this.grid)
      p.x = (Math.floor((this.svg.width()) / this.grid) - 1) * this.grid;
    if (p.y > this.svg.height() - this.grid)
      p.y = (Math.floor((this.svg.height()) / this.grid) - 1) * this.grid;
    if (p.x < this.grid) p.x = this.grid;
    if (p.y < this.grid) p.y = this.grid;
    return p;
  },

  nodeEvents: {},

  nodeRadius: 8,

  getNodeView: function(cid) {
    return _.find(this.nodeViews, function(v) {
      return v.model.cid == cid;
    });
  },

  onAddLink: function(link) {
    console.log('SVGG.Paper.onAddLink', arguments);
    var v = new SVGG.LinkView({
      svg: this.svgLinks,
      model: link,
      source: this.getNodeView(link.get('source')),
      target: this.getNodeView(link.get('target')),
    });
    v.on(this.linkEvents);
    console.log(v);
    this.linkViews.push(v);
  },

  onAddNode: function(node, collection, options) {
    console.log('SVGG.Paper.onAddNode', arguments);
    var v = this.getNodeView(node);
    if (!v) {
      v = new SVGG.NodeView({
	svg: this.svgNodes,
	model: node,
	radius: this.nodeRadius
      });
      v.on(this.nodeEvents);
      this.nodeViews.push(v);
      if (options && options.focus)
	this.setFocus(v);
    }
    return v;
  },

  onRemoveLink: function(link) {
    console.log('SVGG.Editor.onRemoveLink', arguments);
    var v = _.find(this.linkViews, {model: link});
    v.remove();
    _.remove(this.linkViews, v);
  },

  onRemoveNode: function(node) {
    console.log('SVGG.Editor.onRemoveNode', arguments);
    if (node == this.focused.model)
      this.setFocus(null);
    var v = _.find(this.nodeViews, {model: node});
    v.remove();
    _.remove(this.nodeViews, v);
  },

  onResetLinks: function(links) {
    console.log('SVGG.Paper.onResetLinks', arguments);
    _.each(this.linkViews, function(v) {
      v.remove();
    });
    this.linkViews = [];
    links.each(this.onAddLink);
  },

  onResetNodes: function(nodes) {
    console.log('SVGG.Editor.onResetNodes', arguments);
    _.each(this.nodeViews, function(v) {
      v.remove();
    });
    this.nodeViews = [];
    nodes.each(this.onAddNode);
  },

});
