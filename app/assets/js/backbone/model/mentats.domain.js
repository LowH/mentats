
Mentats.CompetencesCollection = Backbone.Collection.extend({
  model: Mentats.Competence,
  url: '/competence'
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

Mentats.Domain = SVGG.Node.extend({

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/domaine/' + this.id;
    this.set('competences', new Mentats.CompetencesGraph(this.get('competences')));
    this.get('competences').url = this.url + '/competences';
  },

  edit: function () {
    console.log('Mentats.Domain.edit', this);
    Mentats.editDomain(this.get('id'));
  },

  parse: function(attr, options) {
    console.log('Domain.parse', attr, options);
    var competences = this.get('competences');
    competences.set(competences.parse(attr.competences, options));
    delete attr.competences;
    return attr;
  },

});
