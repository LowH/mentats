
SVGG.Paper = Backbone.View.extend({

  events: {
    'click .spawnNode': 'spawnNode',
    'mousedown svg': 'onMouseDown',
    'mousemove svg': 'onMouseMove',
  },

  initialize: function(options) {
    _.bindAll(this, 'onAddNode', 'onAddLink', 'stopMoving', 'onNodeMouseDown', 'onNodeMouseUp', 'onNodeClick', 'onNodeDblClick', 'onMouseDown', 'onMouseUp', 'onMouseMove');
    Backbone.View.prototype.initialize.apply(this, options);
    this.grid = options.grid || 8;
    this.svg = SVG(this.$el.find('.paper')[0])
      .fixSubPixelOffset()
      .size(options.width, options.height);
    this.focus = this.svg.rect(20, 20)
      .radius(10)
      .stroke('3px #08F')
      .fill('none');
    this.model.on('addNode', this.onAddNode);
    this.model.on('addLink', this.onAddLink);
  },

  spawnNode: function() {
    console.log('paper spawn node');
    var node = new SVGG.Node({
      name: "",
      position: { x: 10, y: 10 }
    });
    node.promptLabel();
    this.model.get('nodes').add(node);
    //this.focus(node);
    return node;
  },

  onAddNode: function(node) {
    console.log('paper onAddNode');
    var v = new SVGG.NodeView({svg: this.svg, model: node});
    v.on('mousedown', this.onNodeMouseDown);
    v.on('mouseup', this.onNodeMouseUp);
    v.on('click', this.onNodeClick);
    v.on('dblclick', this.onNodeDblClick);
  },

  addLink: function() {
    console.log('paper addLink');
  },

  onAddLink: function(link) {
    console.log('paper onAddLink');    
    var v = new SVGG.LinkView({svg: this.svg, model: link});
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

  onNodeClick: function(node, evt) {
    console.log('onNodeClick', node, evt);
    this.focus = node;
    evt.preventDefault();
  },

  onNodeDblClick: function(node, evt) {
    console.log('onNodeDblClick', node, evt);
    node.model.promptLabel();
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
  }

})
