
Mentats.Competence = SVGG.Node.extend({

  edit: function () {
    console.log('Mentats.Competence.edit', this);
    Mentats.viewCompetence(this.get('id'));
  },

});

Mentats.CompetencesCollection = Backbone.Collection.extend({
  model: Mentats.Competence,
  url: '/j/competence'
});

Mentats.CompetencesGraph = SVGG.Graph.extend({

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.set({
      nodes: new Mentats.CompetencesCollection(this.get('nodes')),
      links: new SVGG.LinksCollection(this.get('links'))
    });
  },

});
