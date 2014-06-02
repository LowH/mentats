
SVGG.Editor = SVGG.Paper.extend({

  events: {
    'click .spawnNode': 'spawnNode',
    'click .renameNode': 'renameNode',
    'click .removeNode': 'removeNode',
    'click .save': 'save',
    'mousedown svg': 'onMouseDown',
    'mousemove svg': 'onMouseMove',
    'click svg': 'onClick'
  },

  initialize: function() {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'renameNode', 'onAddNode', 'onAddLink', 'stopMoving', 'onNodeMouseDown', 'onNodeMouseUp', 'onNodeClick', 'onNodeDblClick', 'onMouseDown', 'onMouseUp', 'onMouseMove', 'onClick');

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

    this.focus = this.svg.rect(40, 30)
      .radius(10)
      .move(-2, -2)
      .stroke({color:'#ADF', width:4})
      .fill('none')
      .hide();
    this.focused = null;
  },

  renameNode: function () {
    if (this.focused)
      this.focused.model.promptName();
  },

  removeNode: function () {
    if (this.focused)
      this.focused.model.destroy();
  },

  onAddNode: function(node) {
    console.log('SVGG.Editor.onAddNode', arguments);
    var v = new SVGG.NodeView({
      svg: this.svg,
      model: node
    });
    v.on({
      mousedown: this.onNodeMouseDown,
      mouseup: this.onNodeMouseUp,
      click: this.onNodeClick,
      dblclick: this.onNodeDblClick
    });
    this.nodeViews.push(v);
  },

  onRemoveNode: function(node) {
    console.log('SVGG.Editor.onRemoveNode', arguments);
    if (node == this.focused.model)
      this.setFocus(null);
    var v = _.find(this.nodeViews, {model: node});
    v.remove();
    _.remove(this.nodeViews, v);
  },

  onResetNodes: function(nodes) {
    console.log('SVGG.Editor.onResetNodes', arguments);
    _.each(this.nodeViews, function(v) {
      v.remove();
    });
    this.nodeViews = [];
    nodes.each(this.onAddNode);
  },

  onAddLink: function(link) {
    console.log('paper onAddLink');    
    var v = new SVGG.LinkView({
      svg: this.svg,
      model: link
    });
    this.linkViews.push(v);
  },

  onRemoveLink: function(link) {
    console.log('SVGG.Editor.onRemoveLink', arguments);
    var v = _.find(this.linkViews, {model: link});
    v.remove();
    _.remove(this.linkViews, v);
  },

  onResetLinks: function(links) {
    _.each(this.linkViews, function(v) {
      v.remove();
    });
    this.linkViews = [];
    _.each(links, this.onAddLink);
  },

  stopMoving: function(evt) {
    console.log('Paper.stopMoving', this);
    $(window).off('mouseup', this.stopMoving);
    this.moving = null;
    evt.preventDefault();
  },

  onNodeMouseDown: function(nodeView, evt) {
    console.log('onNodeMouseDown', nodeView, evt);
    var position = nodeView.model.get('position');
    this.moving = {
      nodeView: nodeView,
      clientX: position.x - evt.clientX,
      clientY: position.y - evt.clientY
    };
    $(window).on('mouseup', this.stopMoving);
    this.setFocus(nodeView);
    evt.preventDefault();
  },

  onNodeMouseUp: function(node, evt) {
    console.log('onNodeMouseUp', node, evt);
    if (this.moving) {
      this.stopMoving(evt);
      evt.stopPropagation();
    }
  },

  resizeFocus: function (w, h) {
    if (this.focused)
      this.focus.size(w + 4, h + 4);
  },

  setFocus: function (node) {
    console.log('setFocus', this.focused, node);
    if (this.focused != node) {
      if (this.focused)
	this.stopListening(this.focused, 'resize', this.resizeFocus);
      this.focused = node;
      if (node) {
	this.listenTo(node, 'resize', this.resizeFocus);
	this.resizeFocus(node.rect.width(), node.rect.height());
	this.focus
	  .addTo(node.group)
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

  onNodeClick: function(node, evt) {
    console.log('onNodeClick', node, evt);
    evt.preventDefault();
    evt.stopPropagation();
  },

  onNodeDblClick: function(node, evt) {
    console.log('onNodeDblClick', node, evt);
    node.model.promptName();
  },

  onMouseDown: function() {
    //console.log('onmousedown');
  },

  onMouseUp: function(evt) {
    console.log('Paper.onMouseUp', evt);
    this.moving = null;
    evt.preventDefault();
  },

  onMouseMove: function(evt) {
    if (this.moving) {
      //console.log(this.moving);
      var p = {
	x: evt.clientX + this.moving.clientX,
	y: evt.clientY + this.moving.clientY
      };
      p.x = Math.round(p.x / this.grid) * this.grid;
      p.y = Math.round(p.y / this.grid) * this.grid;
      if (p.x < this.grid) p.x = this.grid;
      if (p.y < this.grid) p.y = this.grid;
      var w = this.moving.nodeView.rect.width();
      var h = this.moving.nodeView.rect.height();
      if (p.x + w > this.svg.width() - this.grid)
	p.x = (Math.floor((this.svg.width() - w) / this.grid) - 1) * this.grid;
      if (p.y + h > this.svg.height() - this.grid)
	p.y = (Math.floor((this.svg.height() - h) / this.grid) - 1) * this.grid;
      this.moving.nodeView.model.set({
	position: p
      });
      evt.preventDefault();
    }
  },

  onClick: function (evt) {
    console.log('onClick', evt);
    this.setFocus(null);
  }

});
