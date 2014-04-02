/*
 *= require backbone/model/mentats.graph-element
 *= require backbone/model/mentats.graph-link
 *= require backbone/model/mentats.graph-cells
 *= require backbone/model/mentats.graph
 *= require backbone/view/mentats.graph-element-view
 *= require backbone/view/mentats.graph-link-view
 *= require backbone/view/mentats.graph-editor
 */

////  TEST


$(function() {
  $('.mentats.graph.editor').each(function() {
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
});
