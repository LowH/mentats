
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
    _.bindAll(this, 'nodePosition', 'onArrowMouseDown', 'onKey', 'renameNode', 'stopMoving', 'onNodeMouseDown', 'onNodeMouseUp', 'onNodeClick', 'onNodeDblClick', 'onMouseDown', 'onMouseUp', 'onMouseMove', 'onClick', 'onToolbarClick', 'onWindowClick');

    this.nodeEvents = {
      mousedown: this.onNodeMouseDown,
      mouseup: this.onNodeMouseUp,
      click: this.onNodeClick,
      dblclick: this.onNodeDblClick
    },

    this.linkEvents = {
      arrowmousedown: this.onArrowMouseDown
    };

    $(window).on({
      click: this.onWindowClick,
      keydown: this.onKey
    });
  },

  moveFocus: function (direction) {
    var o = this.focused;
    var m;
    switch (direction) {
    case 0: m = function (c) { return {a:(o.y - c.y), b:(c.x - o.x)}; }; break;
    case 1: m = function (c) { return {a:(c.x - o.x), b:(c.y - o.y)}; }; break;
    case 2: m = function (c) { return {a:(c.y - o.y), b:(c.x - o.x)}; }; break;
    case 3: m = function (c) { return {a:(o.x - c.x), b:(c.y - o.y)}; }; break;
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
      this.focused.model.save({position: p});
    }
  },

  toGrid: function (x) {
    return Math.round(x / this.grid) * this.grid;
  },

  nodePosition: function (x, y, w, h) {
    x = this.toGrid(x);
    y = this.toGrid(y);
    if (w || h) {
      if (x + w > this.width - this.grid)
	x = this.toGrid(this.width - w) - this.grid;
      if (y + h > this.height - this.grid)
	y = this.toGrid(this.height - h) - this.grid;
      if (x < this.grid) x = this.grid;
      if (y < this.grid) y = this.grid;
    }
    return {x: x, y: y};
  },

  onArrowMouseDown: function (linkView, evt) {
    console.log('SVGG.Editor.onArrowMouseDown', evt);
    if (evt.button == 0) {
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
    if (evt.button == 0) {
      this.setFocus(null);
      if (evt && evt.stopPropagation)
	evt.stopPropagation();
    }
  },

  onKey: function(evt) {
    var k = evt.charCode ? String.fromCharCode(evt.charCode) : evt.keyCode;
    console.log('SVGG.Editor.onKey', k, evt);
    switch (k) {
    case 13: // Enter
      if (this.focused) {
	evt.preventDefault();
	this.focused.model.promptName(true);
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
	this.removeNode();
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
      var p = this.nodePosition(evt.pageX + this.moving.pageX,
				evt.pageY + this.moving.pageY,
				this.moving.nodeView.width,
				this.moving.nodeView.height);
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
    if (evt.button == 0) {
      this.moving = null;
      if (this.newLink) {
	this.model.save();
	this.newLink.remove();
	this.newLink = null;
      }
      evt.preventDefault();
    }
  },

  onNodeClick: function(node, evt) {
    console.log('onNodeClick', node, evt);
    if (evt.button == 0) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  },

  onNodeDblClick: function(node, evt) {
    console.log('onNodeDblClick', node, evt);
    if (evt.button == 0) {
      if (node.model.edit) {
	node.model.edit();
      }
    }
  },

  onNodeMouseDown: function(nodeView, evt) {
    console.log('onNodeMouseDown', nodeView, evt);
    if (evt.button == 0) {
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
	  pageY: position.y - evt.pageY,
	  prevPos: _.clone(position)
	};
	$(window).on('mouseup', this.stopMoving);
	this.setFocus(nodeView);
      }
      evt.preventDefault();
    }
  },

  onNodeMouseUp: function(node, evt) {
    console.log('onNodeMouseUp', node, evt);
    if (evt.button == 0) {
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
	this.model.save();
      }
    }
  },

  onToolbarClick: function (evt) {
    console.log('onToolbarClick', evt);
    if (evt.button == 0) {
      if (evt && evt.stopPropagation)
	evt.stopPropagation();
    }
  },

  onWindowClick: function (evt) {
    console.log('onWindowClick', evt);
    if (evt.button == 0) {
      this.setFocus(null);
    }
  },

  removeNode: function () {
    if (this.focused) {
      this.model.remove(this.focused.model);
      this.model.save();
    }
  },

  renameNode: function (evt) {
    if (this.focused) {
      this.focused.model.promptName(true);
      if (evt && evt.stopPropagation)
	evt.stopPropagation();
    }
  },

  spawnLinked: function (direction) {
    var sourceView = this.focused;
    var source = sourceView.model;
    var target = this.spawnNode();
    var targetView = this.onAddNode(target);
    var p = _.clone(source.get('position'));
    switch (direction) {
    case 0: p.y = p.y - this.grid * 4 - targetView.height; break;
    case 1: p.x = p.x + this.grid * 4 + sourceView.width; break;
    case 2: p.y = p.y + this.grid * 4 + sourceView.height; break;
    case 3: p.x = p.x - this.grid * 4 - targetView.width; break;
    }
    p = this.nodePosition(p.x, p.y, targetView.width, targetView.height);
    target.save({position: p});
    this.model.link(source, target);
    this.model.save();
  },

  stopMoving: function(evt) {
    console.log('Paper.stopMoving', this);
    $(window).off('mouseup', this.stopMoving);
    var v = this.moving.nodeView;
    if (v) {
      var p = v.model.get('position');
      if (p.x != this.moving.prevPos.x ||
	  p.y != this.moving.prevPos.y)
	v.model.save();
    }
    this.moving = null;
    evt.preventDefault();
  }

});
