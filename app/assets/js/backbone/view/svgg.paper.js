
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

    this.nodeViews = [];
    this.linkViews = [];

    this.grid = options.grid || 8;
    this.$paper = this.$el.find('.paper');
    if (!this.$paper.length)
      this.$paper = $('<div class="paper"></div>').appendTo(this.$el);
    this.log(this.$paper);
    this.svg = SVG(this.$paper[0])
      .fixSubPixelOffset();
    if (options.width && options.height)
      this.resize(options.width, options.height);
    this.svgNodes = this.svg.group();
    this.svgLinks = this.svg.group();

    var nodes = this.model.get('nodes');
    nodes.each(this.onAddNode);
    this.listenTo(nodes, 'add', this.onAddNode);
    this.listenTo(nodes, 'remove', this.onRemoveNode);
    this.listenTo(nodes, 'reset', this.onResetNodes);

    var links = this.model.get('links');
    links.each(this.onAddLink);
    this.listenTo(links, 'add', this.onAddLink);
    this.listenTo(links, 'remove', this.onRemoveLink);
    this.listenTo(links, 'reset', this.onResetLinks);

    this.updateFocusStyle(options.focus);
    this.focused = null;
  },

  linkEvents: {},

  log: debug.logger('SVGG.Paper'),

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

  getNodeView: function(node) {
    if (_.isObject(node))
      return _.find(this.nodeViews, { model: node});
    return _.find(this.nodeViews, function(v) {
      this.log('getNodeView', node, v.model);
      return v.model.cid == node || v.model.id == node;
    }, this);
  },

  getLinkView: function(link) {
    return _.find(this.linkViews, function(v) {
      return (v.model.get('source') === link.get('source') &&
	      v.model.get('target') === link.get('target'));
    });
  },

  onAddLink: function(link) {
    this.log('onAddLink', arguments);
    var source = this.getNodeView(link.get('source'));
    var target = this.getNodeView(link.get('target'));
    if (!source || !target)
      return;
    var v = this.getLinkView(link);
    if (!v) {
      v = new SVGG.LinkView({
	model: link,
	paper: this,
	source: source,
	svg: this.svgLinks,
	target: target
      });
      v.on(this.linkEvents);
    }
    this.log(v);
    this.linkViews.push(v);
  },

  onAddNode: function(node, collection, options) {
    this.log('onAddNode', this, node, collection, options);
    var v = this.getNodeView(node);
    if (!v) {
      v = new SVGG.NodeView({
	model: node,
	paper: this,
	radius: this.nodeRadius,
	svg: this.svgNodes
      });
      v.on(this.nodeEvents);
      this.nodeViews.push(v);
      if (options && options.focus)
	this.setFocus(v);
      var links = this.model.get('links');
      links.each(function (link) {
	var source = link.get('source');
	var target = link.get('target');
	if ((source === node.cid || source === node.id
	     || target === node.cid || target === node.id)
	    && !this.getLinkView(link))
	  this.onAddLink(link);
      }, this);
      this.refreshAutocrop();
    }
    return v;
  },

  onRemoveLink: function(link) {
    this.log('onRemoveLink', arguments);
    var v = _.find(this.linkViews, {model: link});
    v.remove();
    _.remove(this.linkViews, v);
  },

  onRemoveNode: function(node) {
    this.log('onRemoveNode', arguments);
    if (node == this.focused.model)
      this.setFocus(null);
    var v = _.find(this.nodeViews, {model: node});
    v.remove();
    _.remove(this.nodeViews, v);
    this.refreshAutocrop();
  },

  onResetLinks: function(links) {
    this.log('onResetLinks', arguments);
    _.each(this.linkViews, function(v) {
      v.remove();
    });
    this.linkViews = [];
    links.each(this.onAddLink);
  },

  onResetNodes: function(nodes) {
    this.log('onResetNodes', arguments);
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
      var x = r.x - 8;
      var y = r.y - 8;
      var w = r.width + 16;
      var h = r.height + 16;
      this.log('refreshAutocrop ', r, x, y, w, h);
      this.resize(w, h, x, y);
    }
  },

  resize: function (w, h, x, y) {
    x || (x = 0);
    y || (y = 0);
    this.svg.width(w).height(h).viewbox(x - 0.5, y - 0.5, w - 0.5, h - 0.5);
  },

  resizeFocus: function (w, h) {
    if (this.focused)
      this.focus.size(w + 4, h + 4);
  },

  setFocus: function (node, options) {
    this.log('setFocus', this.focused, node);
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
