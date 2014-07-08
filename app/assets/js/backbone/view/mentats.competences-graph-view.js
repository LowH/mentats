
Mentats.CompetencesGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.competenceRadius,

  initialize: function (options) {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.nodeEvents = {
      click: this.onNodeClick,
    };
  },

  onNodeClick: function (node, evt) {
    console.log('Mentats.CompetencesGraphView.onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewCompetence(node.model.get('id'));
      evt.stopPropagation();
    }
  },

});

Mentats.competencesGraph = function () {
  var $this = $(this);
  var domain = Mentats.getDomain($this.data('domain'));
  var view = new Mentats.CompetencesGraphView({
    model: domain.get('competences'),
    el: this,
    autocrop: true,
  });
  console.log(view);
};

$(function () {
  $('.competences-graph').each(Mentats.competencesGraph);
});
