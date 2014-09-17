
Mentats.Domain = SVGG.Node.extend({

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/domaine/' + this.id;
    this.set('competences', new Mentats.CompetencesGraph(this.get('competences')));
    this.get('competences').url = this.url + '/competences';
  },

  edit: function () {
    console.log('Mentats.Domain.edit', this);
    var id = this.get('id');
    if (id)
      Mentats.editDomain(id);
  },

  parse: function(attr, options) {
    console.log('Domain.parse', attr, options);
    var competences = this.get('competences');
    competences.set(competences.parse(attr.competences, options));
    delete attr.competences;
    return attr;
  }

});

Mentats.DomainsCollection = Backbone.Collection.extend({
  model: Mentats.Domain,
  url: '/j/domaine'
});

Backbone.Model.cache(Mentats.Domain, Mentats.DomainsCollection);

Mentats.DomainsGraph = SVGG.Graph.extend({

  nodesCollection: Mentats.DomainsCollection

});
