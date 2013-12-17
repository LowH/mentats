var competences;

$(function() {

  // Helpers.
  // --------

  function buildGraph(g) {

    var elements = [];
    var links = [];

    _.each(g, function(node) {
      elements.push(makeElement(node));

      _.each(node.pred, function(predecessorLabel) {
        links.push(makeLink(predecessorLabel, node.label));
      });
    });

    var nodes = $('svg g.element[model-id]');
    nodes.click(function() {
      nodes.removeClass('focus');
      this.addClass('focus');
    });

    // Links must be added after all the elements. This is because when the links
    // are added to the graph, link source/target
    // elements must be in the graph already.
    return elements.concat(links);
  }

  function makeLink(parentElementLabel, childElementLabel) {

    return new joint.dia.Link({
      source: { id: parentElementLabel },
      target: { id: childElementLabel },
      attrs: { '.marker-target': { d: 'M 4 0 L 0 2 L 4 4 z' },
	       '.line': { 'stroke-width': '3px' } },
      smooth: false
    });
  }

  function makeElement(node) {

    var maxLineLength = _.max(node.label.split('\n'), function(l) { return l.length; }).length;

    // Compute width/height of the rectangle based on the number
    // of lines in the label and the letter size. 0.6 * letterSize is
    // an approximation of the monospace font letter width.
    var letterSize = 14;
    var width = (letterSize * (0.6 * (maxLineLength + 2)));
    var height = ((node.label.split('\n').length + 1) * letterSize);

    return new joint.shapes.mentats.Competence({
      id: node.label,
      size: { width: width, height: height },
      attrs: {
        text: { text: node.label, 'font-size': letterSize, 'font-family': 'monospace' },
        rect: {
          width: width, height: height,
          rx: 5, ry: 5,
          stroke: '#555'
        }
      }
    });
  }

  // Main.
  // -----

  competences = {
    graph: new joint.dia.Graph,

    add: function () {
      this.graph.addCell(makeElement({label: '?'}));
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
		 joint.layout.DirectedGraph.layout(self.graph, { setLinkVertices: false });
	       }});
    }
  };

  competences.load('demo');

  var paper = new joint.dia.Paper({
    el: $('#paper'),
    width: 900,
    height: 600,
    gridSize: 10,
    model: competences.graph
  });
  console.log(paper);
  paper.on({
    'cell:pointerdown': function(cell) {
      console.log('cell:pointerdown', cell);
      if (cell.model.get('type') != "mentats.Competence") return;
      var previous = paper.model.get('focusedCell');
      if (previous == cell) return;
      if (previous) previous.trigger('competence:blur');
      cell.trigger('competence:focus');
      paper.model.set('focusedCell', cell);
    },
    'competence:focus': function (cell) {
      console.log('competence:focus', cell);
      cell.$el.addClass('focused');
    },
    'competence:blur': function (cell) {
      console.log('competence:blur', cell);
      cell.$el.removeClass('focused');
    }
  });

  // Just give the viewport a little padding.
  V(paper.viewport).translate(20, 20);

});
