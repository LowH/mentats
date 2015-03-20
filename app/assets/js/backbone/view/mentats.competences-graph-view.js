
Mentats.CompetencesGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.competenceRadius,

  initialize: function (options) {
    debug.log('Mentats.CompetencesGraphView', 'new', options);
    this.nodeEvents = {
      click: options.onNodeClick || this.onNodeClick
    };
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    if (options.domain)
      this.$el.addClass('competences-graph').attr('data-domain', options.domain.id);
  },

  onNodeClick: function (node, evt) {
    debug.log('Mentats.CompetencesGraphView', 'onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewCompetence(node.model.get('id'));
      evt.stopPropagation();
    }
  }

});

Mentats.competencesGraph = function () {
  try {
    var $this = $(this);
    var domain = Mentats.Domain.find($this.data('domain'));
    var view = new Mentats.CompetencesGraphView({
      model: domain.get('competences'),
      el: this,
      autocrop: true
    });
    debug.log('Mentats.competencesGraph', view);
  }
  catch (e) {
    debug.log('Mentats.competencesGraph', e);
  }
};

$(function () {
  $('.competences-graph').each(Mentats.competencesGraph);
});
