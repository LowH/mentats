
Mentats.Competence = SVGG.Node.extend({

  edit: function () {
    console.log('Mentats.Competence.edit', this);
    var id = this.get('id');
    if (id)
      Mentats.viewCompetence(id);
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
  }

});

Mentats.CompetencesCollection = Backbone.Collection.extend({
  model: Mentats.Competence,
  url: '/j/competence',

  toJSON: function () {
    return this.pluck('id');
  }

});

Backbone.Model.cache(Mentats.Competence, Mentats.CompetencesCollection);

Mentats.CompetencesGraph = SVGG.Graph.extend({

  nodeModel: Mentats.Competence,

  initialize: function (options) {
    SVGG.Graph.prototype.initialize.apply(this, arguments);
  }

});
