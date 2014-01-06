/*
 *= require jquery
 *= require jquery.sortElements
 *= require bootstrap
 *= require joint.nojquery
 *= require joint.layout.DirectedGraph
 *= require graph
 */

$(function () {

  $('.competence .edit .btn.edit').click(function () {
    $this = $(this);
    if ($this.hasClass('active')) {
      $(this).removeClass('active');
    } else {
      $(this).addClass('active');
    }
  });

});
