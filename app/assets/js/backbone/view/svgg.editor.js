
SVGG.Editor = SVGG.Paper.extend({

  events: {
    'click .spawnNode': 'spawnNode',
    'click .save': 'save',
    'mousedown svg': 'onMouseDown',
    'mousemove svg': 'onMouseMove',
    'click svg': 'onClick'
  },

  initialize: function() {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onAddNode', 'onAddLink', 'stopMoving', 'onNodeMouseDown', 'onNodeMouseUp', 'onNodeClick', 'onNodeDblClick', 'onMouseDown', 'onMouseUp', 'onMouseMove', 'onClick');
    this.model.get('nodes').each(this.onAddNode);
    this.model.get('links').each(this.onAddLink);
    this.listenTo(this.model.get('nodes'), 'add', this.onAddNode);
    this.listenTo(this.model.get('links'), 'add', this.onAddLink);
    this.focus = this.svg.rect(40, 30)
      .radius(10)
      .move(-2, -2)
      .stroke({color:'#ADF', width:3})
      .fill('none')
      .hide();
    this.focused = null;
  },

  onAddNode: function(node) {
    console.log('SVGG.Editor.onAddNode', arguments);
    var v = new SVGG.NodeView({
      svg: this.svg,
      model: node
    });
    v.on('mousedown', this.onNodeMouseDown);
    v.on('mouseup', this.onNodeMouseUp);
    v.on('click', this.onNodeClick);
    v.on('dblclick', this.onNodeDblClick);
  },

  onAddLink: function(link) {
    console.log('paper onAddLink');    
    var v = new SVGG.LinkView({
      svg: this.svg,
      model: link
    });
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
      }
      else {
	this.focus
	  .addTo(this.svg)
	  .hide();
      }
    }
  },

  onNodeClick: function(node, evt) {
    console.log('onNodeClick', node, evt);
    this.setFocus(node);
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
