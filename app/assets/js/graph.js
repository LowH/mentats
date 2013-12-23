
var mentats = { graph: {} };

mentats.graph.Element = joint.dia.Element.extend({

  markup: ('<rect class="focus box" rx="5" ry="5"/>' +
	   '<rect class="main box" rx="5" ry="5"/>' +
	   '<text class="name"/>' +
	   '<circle class="focus link btn" r="4" />'),

  defaults: joint.util.deepSupplement({
    type: 'mentats.graph.Element',
    attrs: {
      '.main.box': { fill: '#FFFFFF',
		     stroke: 'black',
		     'stroke-width': 1 },
      '.box': { width: 1, height: 1 },
      'circle.btn': { 'ref-dx': -5,
		      'ref-dy': -5,
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
    // FIXME: remove multiple links to same target
    var localPoint = this.paper.snapToGrid({ x: evt.clientX, y: evt.clientY });
    var linkView = this.paper.spawnLink({ id: this.model.id }, localPoint);
    evt.target = linkView.$('.marker-arrowhead[end="target"]')[0];
    this.paper.pointerdown(evt);
    evt.stopPropagation();
  },

});

mentats.graph.Link = joint.dia.Link.extend({

  defaults: joint.util.deepSupplement({
    type: 'mentats.graph.Link',
    attrs: { '.marker-target': { d: 'M 8 -2 L 0 2 L 8 6 z' },
	     '.line': { 'stroke-width': '3px' } },
    smooth: false
  }, joint.dia.Link.prototype.defaults)

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
      console.log('remove', this.model);
      this.model.remove();
    }
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

  initialize: function () {
    joint.dia.Paper.prototype.initialize.apply(this, arguments);
    this.on({ 'resize': this.resizeViewBox });
    this.resizeViewBox();
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
    if (this.focused)
      this.focused.trigger('blur');
    this.focused = view;
    if (view)
      view.trigger('focus');
  },

  pointerdown: function(evt) {
    evt.preventDefault();
    evt = this.normalizeEvent(evt);
    var view = this.findView(evt.target);
    var localPoint = this.snapToGrid({ x: evt.clientX, y: evt.clientY });
    console.log('editor.pointerdown', evt.target, view);
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
    this.model.addCell(e);
    this.focus(e);
    return e;
  },

  spawnLink: function (source, target) {
    var l = new mentats.graph.Link({ source: source, target: target });
    return this.addCell(l);
  },

  addCell: function(cell) {
    var view = this.createViewForModel(cell);
    V(this.viewport).append(view.el);
    view.paper = this;
    view.render();
    // This is the only way to prevent image dragging in Firefox that works.
    // Setting -moz-user-select: none, draggable="false" attribute or user-drag: none didn't help.
    $(view.el).find('image').on('dragstart', function() { return false; });
    return view;
  }

});
  

////  TEST


var competences;

$(function() {

  // Helpers.
  // --------

  function buildGraph(g) {

    var elements = [];
    var links = [];

    _.each(g, function(node) {
      var e = makeElement(node);
      elements.push(e);
      _.each(node.pred, function(predecessor) {
        links.push(makeLink(predecessor, e.id));
      });
    });

    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    return elements.concat(links);
  }

  function makeElement(node) {

    return new mentats.graph.Element({
      id: node.id || node.label,
      name: node.label,
      position: { x: 10, y: 10 }
    });
  }

  function makeLink(parentId, childId) {

    return new mentats.graph.Link({
      source: { id: parentId },
      target: { id: childId }
    });
  }

  // Main.
  // -----

  competences = {
    graph: new joint.dia.Graph,

    load: function (name) {
      var self = this;
      $.ajax({ url: '/assets/' + name + '.json',
	       cache: false,
	       error: function (xhr, status, err) {
		 console.log(status);
		 console.log(err);
		 console.log(xhr);
	       },
	       success: function(data, status, xhr) {
		 //console.log(data, status, xhr);
		 var cells = buildGraph(data);
		 self.graph.resetCells(cells);
		 joint.layout.DirectedGraph.layout(self.graph,
						   { setLinkVertices: false });
	       }});
    }
  };

  competences.load('demo');

  competences.editor = new mentats.graph.Editor({
    el: $('#paper'),
    width: 900,
    height: 600,
    model: competences.graph
  });
/*
  competences.editor.on({
    'all': function(evt, data) {
      console.log(evt, data);
    }
  });
*/
  $(window).keypress(function (evt) {
    console.log('keypress', evt);
    if (evt.keyCode == 13) { // Enter
      var view = competences.editor.focused;
      if (view) {
	evt.preventDefault();
	view.model.promptName();
      }
    }
  });

});
