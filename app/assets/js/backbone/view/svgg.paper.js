
SVGG.Paper = Backbone.View.extend({

  focusDefaults: {
    color: '#5da5e5',
    width: 4
  },

  initialize: function (options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onAddNode', 'onAddLink');

    this.options = options;
    this.width = options.width;
    this.height = options.height;
    this.autocrop = options.autocrop;

    this.grid = options.grid || 8;
    this.$paper = this.$el.find('.paper');
    if (!this.$paper.length)
      this.$paper = $('<div class="paper"></div>').appendTo(this.$el);
    console.log(this.$paper);
    this.svg = SVG(this.$paper[0])
      .fixSubPixelOffset();
    if (options.width && options.height)
      this.svg.size(options.width, options.height);
    this.svgNodes = this.svg.group();
    this.svgLinks = this.svg.group();

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

    this.updateFocusStyle(options.focus);
    this.focused = null;
  },

  linkEvents: {},

  mousePosition: function (evt) {
    var offset = this.$paper.offset();
    var p = {
      x: evt.pageX - offset.left,
      y: evt.pageY - offset.top
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
      target: this.getNodeView(link.get('target'))
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
    this.refreshAutocrop();
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
    this.refreshAutocrop();
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
    this.refreshAutocrop();
  },

  refreshAutocrop: function () {
    if (this.autocrop) {
      var r = this.svg.bbox();
      r.x -= 8;
      r.y -= 8;
      r.width += 16;
      r.height += 16;
      this.svg.width(r.width).height(r.height).viewbox(r.x, r.y, r.width, r.height);
    }
  },

  resizeFocus: function (w, h) {
    if (this.focused)
      this.focus.size(w + 4, h + 4);
  },

  setFocus: function (node, options) {
    console.log('setFocus', this.focused, node);
    if (node && !(node.model && node.rect))
      node = _.find(this.nodeViews, {model: node});
    if (this.focused != node) {
      if (this.focused)
	this.stopListening(this.focused, 'resize', this.resizeFocus);
      this.focused = node;
      if (node) {
	this.listenTo(node, 'resize', this.resizeFocus);
	this.resizeFocus(node.rect.width(), node.rect.height());
	this.focus
	  .addTo(node.group)
	  .radius(node.radius + 2)
	  .back()
	  .show();
	this.$('.btn.renameNode').removeClass('disabled');
	this.$('.btn.removeNode').removeClass('disabled');
      }
      else {
	this.focus
	  .addTo(this.svg)
	  .hide();
	this.$('.btn.renameNode').addClass('disabled');
	this.$('.btn.removeNode').addClass('disabled');
      }
    }
  },

  updateFocusStyle: function (opt) {
    opt = _.merge(this.focusDefaults, opt);
    if (!this.focus) {
      this.focus = this.svg.rect(40, 30)
	.hide();
    }
    this.focus
      .move(- opt.width / 2, - opt.width / 2)
      .stroke({
	color: opt.color,
	width: opt.width
      })
      .fill('none');
  }

});
