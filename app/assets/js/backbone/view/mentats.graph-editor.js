Mentats.GraphEditor = joint.dia.Paper.extend({

  options: {
    width: 800,
    height: 600,
    gridSize: 5,
    perpendicularLinks: false,
    elementView: Mentats.GraphElementView,
    linkView: Mentats.GraphLinkView,
  },
  /*
    findView: function(el) {
      console.log('findView', el);
        var $el = this.$(el);

        if ($el.length === 0 || $el[0] === this.el) {
            return undefined;
        }

        if ($el.data('view')) {

	  console.log('findView ->', $el.data('view'));
            return $el.data('view');
        }

        return this.findView($el.parent());
    },
  */
  initialize: function () {
    _.bindAll(this, 'keypress', 'spawnElement', 'spawnLink');
    joint.dia.Paper.prototype.initialize.apply(this, arguments);
    this.on({ 'resize': this.resizeViewBox });
    this.resizeViewBox();
    $(window).on('keypress', this.keypress);
  },

  resizeViewBox: function () {
    V(this.svg).attr('viewBox', ('-0.5 -0.5 ' +
				 (this.options.width + 0.5) + ' ' +
				 (this.options.height + 0.5)));
  },

  focus: function (view) {
    if (view && (_.isString(view) || (!view.el && view.id)))
      view = this.findViewByModel(view);
    if (this.focused == view)
      return;
    if (this.focused) {
      this.focused.trigger('blur');
      if (this.options.toolbar && !view)
	this.options.toolbar.find('.btn.renameElement').addClass('disabled');
    }
    else if (this.options.toolbar && view)
      this.options.toolbar.find('.btn.renameElement').removeClass('disabled');
    this.focused = view;
    if (view)
      view.trigger('focus');
  },

  moveFocus: function (direction) {
    var o = this.focused.model.get('position');
    var m;
    switch (direction) {
    case 0: m = function (c) { return {a:(o.y - c.y), b:(c.x - o.x)}}; break;
    case 1: m = function (c) { return {a:(c.x - o.x), b:(c.y - o.y)}}; break;
    case 2: m = function (c) { return {a:(c.y - o.y), b:(c.x - o.x)}}; break;
    case 3: m = function (c) { return {a:(o.x - c.x), b:(c.y - o.y)}}; break;
    }
    var s = null;
    var sd = 1000000000;
    this.model.get('cells').each(function (cell) {
      if (cell == this.focused) return;
      var c = cell.get('position');
      if (!c) return;
      var d = m(c);
      if (d.a > 0 &&
	  Math.abs(d.b)/4 <= d.a &&
	  d.a * d.a + d.b * d.b < sd) {
	s = cell;
	sd = d.a * d.a + d.b * d.b;
      }
    });
    if (s)
      this.focus(s);
  },

  spawnLinked: function (direction) {
    var s = this.focused.model;
    var e = this.spawnElement();

    var p = s.get('position');
    switch (direction) {
    case 0: p.y = p.y - 30 - e.get('size').height; break;
    case 1: p.x = p.x + 30 + s.get('size').width; break;
    case 2: p.y = p.y + 30 + s.get('size').height; break;
    case 3: p.x = p.x - 30 - e.get('size').width; break;
    }
    e.set({position: p});
    var l = new Mentats.GraphLink({source: s, target: e });
    this.model.get('cells').add(l);
  },

  moveFocused: function (direction) {
    var p = this.focused.model.get('position');
    switch (direction) {
    case 0: p.y = p.y - 5; break;
    case 1: p.x = p.x + 5; break;
    case 2: p.y = p.y + 5; break;
    case 3: p.x = p.x - 5; break;
    }
    this.focused.model.set({position: p});
  },

  removeFocused: function () {
    var cells = this.model.get('cells');
    var links = cells.getConnectedLinks(this.focused);
    console.log('cells', cells, links);
    _.each(links, function (x) {
      console.log('rm', arguments);
      x.remove();
    });
    this.focused.remove();
  },

  keypress: function(evt) {
    console.log('keypress', evt);
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

  pointerdown: function(evt) {
    evt.preventDefault();
    evt = this.normalizeEvent(evt);
    var view = this.findView(evt.target);
    var localPoint = this.snapToGrid({ x: evt.clientX, y: evt.clientY });
    //console.log('editor.pointerdown', evt.target, view);
    if (view) {
      this.sourceView = view;
      if (view.model.get('type') == 'Mentats.GraphElement')
	this.focus(view);
      view.pointerdown(evt, localPoint.x, localPoint.y);
    } else {
      this.focus(null);
      this.trigger('blank:pointerdown', evt, localPoint.x, localPoint.y);
    }
  },

  pointermove: function(evt) {
    evt.preventDefault();
    evt = this.normalizeEvent(evt);
    if (this.sourceView) {
      var localPoint = this.snapToGrid({ x: evt.clientX, y: evt.clientY });
      this.sourceView.pointermove(evt, localPoint.x, localPoint.y);
    }
  },

  spawnElement: function () {
    var e = new Mentats.GraphElement({
      name: "",
      position: { x: 10, y: 10 }
    });
    e.promptName();
    this.model.get('cells').add(e);
    this.focus(e);
    return e;
  },

  renameElement: function () {
    if (this.focused)
      this.focused.promptName();
  },

  spawnLink: function (source, target) {
    if (target.clientX) {
      var localPoint = this.snapToGrid({ x: target.clientX, y: target.clientY });
      localPoint.event = target;
      target = localPoint;
    }
    var l = new Mentats.GraphLink({ source: source, target: target });
    this.model.get('cells').add(l);
  },

  addCell: function(cell) {
    var view = this.createViewForModel(cell);
    V(this.viewport).append(view.el);
    view.paper = this;
    view.render();

    //console.log('addCell', cell);
    var target = cell.get('target');
    if (target && target.event) {
      //console.log('TARGET', target);
      target.event.target = view.$('.marker-arrowhead[end="target"]')[0];
      this.pointerdown(target.event);
    }

    // This is the only way to prevent image dragging in Firefox that works.
    // Setting -moz-user-select: none, draggable="false" attribute or user-drag: none didn't help.
    $(view.el).find('image').on('dragstart', function() { return false; });
    return view;
  }

});
