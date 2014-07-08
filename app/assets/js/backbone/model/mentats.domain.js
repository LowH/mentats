
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
  },

});

Mentats.DomainsCollection = Backbone.Collection.extend({
  model: Mentats.Domain,
  url: '/j/domaine'
});

Mentats.domains = new Mentats.DomainsCollection;

Mentats.getDomain = function (id) {
  var d = Mentats.domains.get(id);
  if (d)
    return d;
  d = new Mentats.Domain({id: id});
  d.fetch();
  Mentats.domains.add(d);
  return d;
};

Mentats.DomainsGraph = SVGG.Graph.extend({

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.set({
      nodes: new Mentats.DomainsCollection(this.get('nodes')),
      links: new SVGG.LinksCollection(this.get('links'))
    });
  },

});
