
$('#module-graph-editor').each(function() {
  var module = new Mentats.Module();
  module.url = $(this).data('url');

  var graph = new SVGG.Graph();
  var editor = new SVGG.Paper({model: graph, el: this, width: 900, height: 450});

  var updateModule = function () {
    console.log('updateModule');
  };

  var updateGraph = function() {
  };

  graph.on('change', updateModule);

  // test
  graph.addNode(new SVGG.Node({ label: "Plop" }));
});
