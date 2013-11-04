var competences = {};

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
	       '.line': { 'stroke-width': '2px' } },
      smooth: true
    });
  }

  function makeElement(node) {

    var maxLineLength = _.max(node.label.split('\n'), function(l) { return l.length; }).length;

    // Compute width/height of the rectangle based on the number
    // of lines in the label and the letter size. 0.6 * letterSize is
    // an approximation of the monospace font letter width.
    var letterSize = 12;
    var width = 2 * (letterSize * (0.6 * maxLineLength + 1));
    var height = 2 * ((node.label.split('\n').length + 1) * letterSize);

    return new joint.shapes.basic.Rect({
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

  var graph = new joint.dia.Graph;

  var paper = new joint.dia.Paper({

    el: $('#paper'),
    width: 900,
    height: 600,
    gridSize: 1,
    model: graph
  });

  // Just give the viewport a little padding.
  V(paper.viewport).translate(20, 20);

  competences.load = function (name) {
    $.ajax({ url: '/graphs/' + name + '.json',
	     complete: function (xhr, status) {
	       console.log('complete', xhr, status);
	     },
	     success: function(data, status, xhr) {
	       console.log('success', data, status, xhr);
	       var cells = buildGraph(data);
	       graph.resetCells(cells);
	       joint.layout.DirectedGraph.layout(graph, { setLinkVertices: false });
	     }});
  }
  competences.load('demo');

});
