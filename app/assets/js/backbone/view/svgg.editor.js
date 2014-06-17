
SVGG.Editor = SVGG.Paper.extend({

  events: {
    'click .spawnNode': 'spawnNode',
    'click .renameNode': 'renameNode',
    'click .removeNode': 'removeNode',
    'click .save': 'save',
    'mousedown svg': 'onMouseDown',
    'mousemove svg': 'onMouseMove',
    'mouseup svg': 'onMouseUp',
    'click svg': 'onClick',
    'click .toolbar': 'onToolbarClick'
  },

  initialize: function (options) {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onArrowMouseDown', 'renameNode', 'stopMoving', 'onNodeMouseDown', 'onNodeMouseUp', 'onNodeClick', 'onNodeDblClick', 'onMouseDown', 'onMouseUp', 'onMouseMove', 'onClick', 'onToolbarClick', 'onWindowClick');

    this.focus = this.svg.rect(40, 30)
      .move(-2, -2)
      .stroke({color:'#ADF', width:4})
      .fill('none')
      .hide();
    this.focused = null;

    this.nodeEvents = {
      mousedown: this.onNodeMouseDown,
      mouseup: this.onNodeMouseUp,
      click: this.onNodeClick,
      dblclick: this.onNodeDblClick
    },

    this.linkEvents = {
      arrowmousedown: this.onArrowMouseDown,
    };

    $(window).on('click', this.onWindowClick);
  },

  moveFocus: function (direction) {
    var o = this.focused;
    var m;
    switch (direction) {
    case 0: m = function (c) { return {a:(o.y - c.y), b:(c.x - o.x)}}; break;
    case 1: m = function (c) { return {a:(c.x - o.x), b:(c.y - o.y)}}; break;
    case 2: m = function (c) { return {a:(c.y - o.y), b:(c.x - o.x)}}; break;
    case 3: m = function (c) { return {a:(o.x - c.x), b:(c.y - o.y)}}; break;
    }
    var s = null;
    var sd = Number.MAX_VALUE;
    _.each(this.nodeViews, function (nodeView) {
      if (nodeView != this.focused) {
	var d = m(nodeView);
	if (d.a > 0 &&
	    Math.abs(d.b)/4 <= d.a &&
	    d.a * d.a + d.b * d.b < sd) {
	  s = nodeView;
	  sd = d.a * d.a + d.b * d.b;
	}
      }
    });
    if (s)
      this.setFocus(s);
  },

  moveFocused: function (direction) {
    if (this.focused) {
      var p = this.focused.model.get('position');
      switch (direction) {
      case 0: p.y = p.y - this.grid; break;
      case 1: p.x = p.x + this.grid; break;
      case 2: p.y = p.y + this.grid; break;
      case 3: p.x = p.x - this.grid; break;
      }
      this.focused.model.set({position: p});
    }
  },

  onArrowMouseDown: function (linkView, evt) {
    console.log('SVGG.Editor.onArrowMouseDown', evt);
    if (evt.button == 1) {
      var p = this.mousePosition(evt);
      this.newLink = new SVGG.LinkView({
	svg: this.svgLinks,
	source: linkView.source,
	target: { x: p.x, y: p.y, width: 0, height: 0 }
      });
      this.model.get('links').remove(linkView.model);
    }
  },

  onClick: function (evt) {
    console.log('onClick', evt);
    if (evt.button == 1) {
      this.setFocus(null);
      if (evt && evt.stopPropagation)
	evt.stopPropagation();
    }
  },

  onKey: function(evt) {
    console.log('SVGG.Editor.onKey', evt);
    switch (evt.keyCode || String.fromCharCode(evt.charCode)) {
    case 13: // Enter
      if (this.focused) {
	evt.preventDefault();
	this.focused.model.promptName();
      }
      break;
    case 'h': case 37: // ←
      if (this.focused) {
	evt.preventDefault();
	var d = 3;
	if (evt.ctrlKey) {
	  this.spawnLinked(3);
	} else {
	  if (evt.shiftKey) {
	    this.moveFocused(3);
	  } else {
	    this.moveFocus(3);
	  }
	}
      }
      break;
    case 'j': case 40: // ↓
      if (this.focused) {
	evt.preventDefault();
	if      (evt.ctrlKey)  { this.spawnLinked(2); }
	else if (evt.shiftKey) { this.moveFocused(2); }
	else                   { this.moveFocus(2); }
      }
      break;
    case 'k': case 38: // ↑
      if (this.focused) {
	evt.preventDefault();
	if      (evt.ctrlKey)  { this.spawnLinked(0); }
	else if (evt.shiftKey) { this.moveFocused(0); }
	else                   { this.moveFocus(0); }
      }
      break;
    case 'l': case 39: // →
      if (this.focused) {
	evt.preventDefault();
	if      (evt.ctrlKey)  { this.spawnLinked(1); }
	else if (evt.shiftKey) { this.moveFocused(1); }
	else                   { this.moveFocus(1); }
      }
      break;
    case 'd': case 46: // delete
      if (this.focused) {
	evt.preventDefault();
	this.removeFocused();
      }
      break;
    }
  },

  onMouseDown: function() {
    //console.log('onmousedown');
  },

  onMouseMove: function(evt) {
    if (this.moving) {
      //console.log(this.moving);
      var p = {
	x: evt.pageX + this.moving.pageX,
	y: evt.pageY + this.moving.pageY
      };
      p.x = Math.round(p.x / this.grid) * this.grid;
      p.y = Math.round(p.y / this.grid) * this.grid;
      var w = this.moving.nodeView.rect.width();
      var h = this.moving.nodeView.rect.height();
      if (p.x + w > this.svg.width() - this.grid)
	p.x = (Math.floor((this.svg.width() - w) / this.grid) - 1) * this.grid;
      if (p.y + h > this.svg.height() - this.grid)
	p.y = (Math.floor((this.svg.height() - h) / this.grid) - 1) * this.grid;
      if (p.x < this.grid) p.x = this.grid;
      if (p.y < this.grid) p.y = this.grid;
      this.moving.nodeView.model.set({
	position: p
      });
      evt.preventDefault();
    }
    else if (this.newLink) {
      var p = this.mousePosition(evt);
      this.newLink.target.x = p.x;
      this.newLink.target.y = p.y;
      this.newLink.onMove();
      evt.preventDefault();
    }
  },

  onMouseUp: function(evt) {
    console.log('SVGG.Editor.onMouseUp', evt);
    if (evt.button == 1) {
      this.moving = null;
      if (this.newLink) {
	this.newLink.remove();
	this.newLink = null;
      }
      evt.preventDefault();
    }
  },

  onNodeClick: function(node, evt) {
    console.log('onNodeClick', node, evt);
    if (evt.button == 1) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  },

  onNodeDblClick: function(node, evt) {
    console.log('onNodeDblClick', node, evt);
    if (evt.button == 1) {
      node.model.promptName();
    }
  },

  onNodeMouseDown: function(nodeView, evt) {
    console.log('onNodeMouseDown', nodeView, evt);
    if (evt.button == 1) {
      if (evt.ctrlKey) {
	var p = this.mousePosition(evt);
	this.newLink = new SVGG.LinkView({
	  svg: this.svgLinks,
	  source: nodeView,
	  target: { x: p.x, y: p.y, width: 0, height: 0 }
	});
      }
      else {
	var position = nodeView.model.get('position');
	this.moving = {
	  nodeView: nodeView,
	  pageX: position.x - evt.pageX,
	  pageY: position.y - evt.pageY
	};
	$(window).on('mouseup', this.stopMoving);
	this.setFocus(nodeView);
      }
      evt.preventDefault();
    }
  },

  onNodeMouseUp: function(node, evt) {
    console.log('onNodeMouseUp', node, evt);
    if (evt.button == 1) {
      if (this.moving) {
	evt.stopPropagation();
	evt.preventDefault();
	this.stopMoving(evt);
      }
      else if (this.newLink) {
	evt.stopPropagation();
	evt.preventDefault();
	var link = this.newLink;
	this.newLink = null;
	link.remove();
	this.model.link(link.source.model, node.model);
      }
    }
  },

  onToolbarClick: function (evt) {
    console.log('onToolbarClick', evt);
    if (evt.button == 1) {
      if (evt && evt.stopPropagation)
	evt.stopPropagation();
    }
  },

  onWindowClick: function (evt) {
    console.log('onWindowClick', evt);
    if (evt.button == 1) {
      this.setFocus(null);
    }
  },

  removeNode: function () {
    if (this.focused)
      this.model.remove(this.focused.model);
  },

  renameNode: function (evt) {
    if (this.focused) {
      this.focused.model.promptName();
      if (evt && evt.stopPropagation)
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

  spawnLinked: function (direction) {
    var s = this.focused.model;
    var e = this.spawnNode();
    var v = this.getNodeView(e);
    var p = s.get('position');
    switch (direction) {
    case 0: p.y = p.y - this.grid * 4 - e.get('size').height; break;
    case 1: p.x = p.x + this.grid * 4 + s.get('size').width; break;
    case 2: p.y = p.y + this.grid * 4 + s.get('size').height; break;
    case 3: p.x = p.x - this.grid * 4 - e.get('size').width; break;
    }
    e.set({position: p});
    this.model.link(s, e);
  },

  stopMoving: function(evt) {
    console.log('Paper.stopMoving', this);
    $(window).off('mouseup', this.stopMoving);
    this.moving = null;
    evt.preventDefault();
  },

});
