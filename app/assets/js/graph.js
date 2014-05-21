/*
 *= require svg
 *= require svgg
 *= require backbone/model/svgg.graph
 *= require backbone/model/svgg.node
 *= require backbone/model/svgg.link
 *= require backbone/view/svgg.paper
 *= require backbone/view/svgg.node-view
 */

$(function() {
  $('.svgg').each(function() {
    var graph = new SVGG.Graph();
    new SVGG.Paper({model: graph, el: this, width: 900, height: 450});
    graph.addNode(new SVGG.Node({ label: "Plop" }));
  });
});

/*
    //console.log(this);
    var $editor = $(this);
    var $toolbar = $editor.find('.toolbar');
    var graph = new Mentats.Graph();
    var paper = new Mentats.GraphEditor({
      el: $editor.find('.paper')[0],
      width: 736,
      height: 420,
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
*/
