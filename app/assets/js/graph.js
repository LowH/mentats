
var mentats = { graph: {} };

mentats.graph.Element = joint.dia.Element.extend({

  markup: '<rect class="box focus"/><rect class="box"/><text class="name"/>',

  defaults: joint.util.deepSupplement({
    type: 'mentats.graph.Element',
    attrs: {
      'rect.box': { fill: '#FFFFFF',
		    stroke: 'black',
		    'stroke-width': 1,
		    width: 1,
		    height: 1,
		    rx: 5,
		    ry: 5 },
      'rect.focus': { fill: '',
		      stroke: '',
		      'stroke-width': 0 },
      'text.name': { 'font-size': 14,
		     text: '',
		     'ref-x': .5,
		     'ref-y': .54,
		     ref: 'rect.box',
		     'y-alignment': 'middle',
		     'x-alignment': 'middle',
		     fill: 'black',
		     stroke: '',
		     'font-family': 'monospace' }
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
    console.log('typeset', arguments);

    var text = this.get('name');
    var maxLineLength = _.max(text.split('\n'), function(l) { return l.length; }).length;
    var letterSize = 14;
    var snap = 2 * 5;
    var width = Math.ceil((letterSize * (0.6 * (maxLineLength + 2))) / snap) * snap;
    var height = Math.ceil(((text.split('\n').length + 1) * letterSize) / snap) * snap;

    var attrs = joint.util.deepSupplement({
      'text.name': { text: text },
      'rect.box': { width: width,
		    height: height }
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
    _.bindAll(this, 'promptName');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    this.on({
      'focus': this.focus,
      'blur': this.blur
    });
  },
  
  focus: function () {
    this.el.classList.add('focused');
    console.log(this.$el.find('text.name'));
    this.$el.find('text.name').on('mousedown', this.promptName);
  },

  blur: function () {
    this.el.classList.remove('focused');
    this.$el.find('text.name').off('mousedown', this.promptName);
  },

  promptName: function (evt) {
    console.log('view.promptName', arguments);
    this.model.promptName();
    evt.preventDefault();
    evt.stopPropagation();
  }

});

mentats.graph.Link = joint.dia.Link.extend({

  defaults: joint.util.deepSupplement({
    type: 'mentats.graph.Link',
    attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' },
	     '.line': { 'stroke-width': '3px' } },
    smooth: false
  }, joint.dia.Link.prototype.defaults)

});

mentats.graph.LinkView = joint.dia.LinkView.extend({

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
    if (view) {
      this.sourceView = view;
      if (view.model.get('type') == 'mentats.graph.Element')
	this.focus(view);
      else
	this.focus(null);
      view.pointerdown(evt, localPoint.x, localPoint.y);
    } else {
      this.focus(null);
      this.trigger('blank:pointerdown', evt, localPoint.x, localPoint.y);
    }
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

    add: function () {
      var e = makeElement({label: '?'});
      this.graph.addCell(e);
      this.editor.focus(e);
    },

    load: function (name) {
      var self = this;
      $.ajax({ url: '/graphs/' + name + '.json',
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
