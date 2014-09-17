
Mentats.Competence = SVGG.Node.extend({

  edit: function () {
    console.log('Mentats.Competence.edit', this);
    var id = this.get('id');
    if (id)
      Mentats.viewCompetence(id);
  }

});

Mentats.CompetencesCollection = Backbone.Collection.extend({
  model: Mentats.Competence,
  url: '/j/competence'
});

Mentats.CompetencesGraph = SVGG.Graph.extend({

  nodesCollection: Mentats.CompetencesCollection

});
