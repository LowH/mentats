
var mentats = { graph: {} };

mentats.graph.Element = joint.dia.Element.extend({

  markup: ('<rect class="focus box" rx="5" ry="5"/>' +
	   '<rect class="main box" rx="5" ry="5"/>' +
	   '<text class="name"/>' +
	   '<circle class="focus link btn" r="4" />'),

  defaults: joint.util.deepSupplement({
    name: '',
    type: 'mentats.graph.Element',
    attrs: {
      '.main.box': { fill: '#FFFFFF',
		     stroke: 'black',
		     'stroke-width': 1 },
      '.box': { width: 1, height: 1 },
      'circle.btn': { 'ref-dx': -5,
		      'ref-dy': -5,
		      ref: '.main.box',
		      'y-alignment': 1,
		      'x-alignment': 1 },
      '.name': { 'font-size': 14,
		 text: '',
		 'ref-x': .5,
		 'ref-y': .54,
		 ref: '.main.box',
		 'y-alignment': 'middle',
		 'x-alignment': 'middle' }
    }
  }, joint.dia.Element.prototype.defaults),

  initialize: function () {
    _.bindAll(this, 'promptName');
    joint.dia.Element.prototype.initialize.apply(this, arguments);
    this.on({
      'change:name': this.typeset
    });
    this.typeset();
  },

  typeset: function () {
    var text = this.get('name');
    var maxLineLength = _.max(text.split('\n'), function(l) { return l.length; }).length;
    var letterSize = 14;
    var snap = 2 * 5;
    var width = Math.ceil((letterSize * (0.6 * (maxLineLength + 2))) / snap) * snap;
    var height = Math.ceil(((text.split('\n').length + 1) * letterSize) / snap) * snap;

    var attrs = joint.util.deepSupplement({
      '.box': { width: width, height: height },
      '.name': { text: text },
    }, this.get('attrs'));

    this.set({
      size: { width: width, height: height },
      attrs: attrs
    });
  },

  promptName: function () {
    var n = prompt("Nouveau nom :", this.get('name'));
    if (n)
      this.set({name: n});
  },

  url: function () {
    return "/competence/id:" + this.id;
  }

});

mentats.graph.ElementView = joint.dia.ElementView.extend({

  initialize: function () {
    _.bindAll(this, 'focus', 'blur', 'promptName', 'linkBtn');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    this.on({
      'focus': this.focus,
      'blur': this.blur
    });
  },
  
  focus: function () {
    this.el.classList.add('focused');
    //this.$el.find('text.name').on('mousedown', this.promptName);
    this.$el.find('.link.btn').on('mousedown', this.linkBtn);
  },

  blur: function () {
    this.el.classList.remove('focused');
    //this.$el.find('text.name').off('mousedown', this.promptName);
    this.$el.find('.link.btn').off('mousedown', this.linkBtn);
  },

  promptName: function (evt) {
    this.model.promptName();
    evt.preventDefault();
    evt.stopPropagation();
  },

  linkBtn: function (evt) {
    this.paper.spawnLink({ id: this.model.id }, evt);
    evt.preventDefault();
    evt.stopPropagation();
  },

});

mentats.graph.Link = joint.dia.Link.extend({

  defaults: joint.util.deepSupplement({
    type: 'mentats.graph.Link',
    attrs: { '.marker-target': { d: 'M 8 -2 L 0 2 L 8 6 z' },
	     '.line': { 'stroke-width': '3px' } },
    smooth: false
  }, joint.dia.Link.prototype.defaults),

  url: function () {
    return "/competence/link:" + this.id;
  }

});

mentats.graph.LinkView = joint.dia.LinkView.extend({

  options: joint.util.deepSupplement({
    shortLinkLength: 50
  }, joint.dia.LinkView.prototype.options),

  /*
  initialize: function() {
    joint.dia.LinkView.prototype.initialize.apply(this, arguments);
    console.log('linkview.initialize', this.$el.data('view'));
  },

  pointerdown: function(evt) {
    console.log('linkview.pointerdown', arguments);
    joint.dia.LinkView.prototype.pointerdown.apply(this, arguments);
  },
  */

  pointerup: function(evt) {
    joint.dia.LinkView.prototype.pointerup.apply(this, arguments);
    var target = this.model.get('target');
    if (!target.id || this.model.get('source').id === target.id) {
      //console.log('remove', this.model);
      this.model.remove();
    }
    // FIXME: remove multiple links to same target
  }

});

mentats.graph.GraphCells = joint.dia.GraphCells.extend({

    model: function(attrs, options) {
      //console.log('model', attrs, options);
      if (attrs.type === 'mentats.graph.Link') {
        return new mentats.graph.Link(attrs, options);
      }

      var module = attrs.type.split('.')[0];
      var entity = attrs.type.split('.')[1];
      if (joint.shapes[module] && joint.shapes[module][entity]) {
        return new joint.shapes[module][entity](attrs, options);
      }
      return new mentats.graph.Element(attrs, options);
    }

});

mentats.graph.Graph = joint.dia.Graph.extend({

  initialize: function() {
    var cells = new mentats.graph.GraphCells;
    this.set('cells', cells);
    cells.on('all', this.trigger, this);
    cells.on('remove', this.removeCell, this);
  },

  /*
  fromJSON: function (json) {
    //console.log(json.cells);
    var options = {add: true, merge: false, remove: false};
    var cells = [];
    _.each(json.cells, function (attrs) {
      //console.log('attrs', attrs);
      var model;
      if (attrs.type == 'mentats.graph.Element')
	model = new mentats.graph.Element(attrs, options);
      else if (attrs.type == 'mentats.graph.Link')
	model = new mentats.graph.Link(attrs, options);
      if (!model._validate(attrs, options)) {
        console.log('invalid', attrs);
      } else {
	cells.push(model);
      }
    });
    //console.log(cells);
    json.cells = cells;
    return joint.dia.Graph.prototype.fromJSON.apply(this, [json]);
  },
  */

  url: function () {
    return "/competence/id:" + this.id;
  }

});

mentats.graph.Editor = joint.dia.Paper.extend({

  options: {
    width: 800,
    height: 600,
    gridSize: 5,
    perpendicularLinks: false,
    elementView: mentats.graph.ElementView,
    linkView: mentats.graph.LinkView,
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

  keypress: function(evt) {
    //console.log('keypress', evt);
    if (evt.keyCode == 13) { // Enter
      var view = this.focused;
      if (view) {
	evt.preventDefault();
	view.model.promptName();
      }
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
      if (view.model.get('type') == 'mentats.graph.Element')
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
    var e = new mentats.graph.Element({
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
    var l = new mentats.graph.Link({ source: source, target: target });
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
  

////  TEST


$(function() {
  $('.mentats.graph.editor').each(function() {
    //console.log(this);
    var $editor = $(this);
    var $toolbar = $editor.find('.toolbar');
    var graph = new mentats.graph.Graph();
    var paper = new mentats.graph.Editor({
      el: $editor.find('.paper')[0],
      width: 900,
      height: 600,
      model: graph,
      toolbar: $toolbar
    });
    $toolbar.find('.btn.addElement').click(function (evt) {
      evt.preventDefault();
      paper.spawnElement();
    });
    $toolbar.find('.btn.renameElement').click(function (evt) {
      evt.preventDefault();
      paper.renameElement();
    });
    $toolbar.find('.btn.save').click(function (evt) {
      evt.preventDefault();
      graph.sync('update', graph);
    });
    graph.fromJSON($editor.data('competence'));
  });
});
