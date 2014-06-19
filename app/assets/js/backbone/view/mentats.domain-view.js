Mentats.CompetenceGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.competenceRadius,

  initialize: function (options) {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.nodeEvents = {
      click: this.onNodeClick,
    };
  },

  onNodeClick: function (evt, node) {
    if (evt.button == 0) {
      Mentats.viewCompetence(node.model.get('id'));
      evt.stopPropagation();
    }
  },

});

Mentats.DomainView = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.DomainView', this);
    this.competenceGraphView = new Mentats.CompetenceGraphView({
      model: this.model.get('competences'),
      el: '#domain-graph-view',
      width: 900,
      height: 602,
    });
  },

});
