
Mentats.Domain = SVGG.Node.extend({

  defaults: {
    name: "",
    position: { x: 10, y: 10 }
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.hasNested('competences', Mentats.CompetencesGraph, {
      init: function (competences) {
        competences.domain = this;
	competences.url = this.url() + '/competences';
      }
    });
  },

  edit: function () {
    console.log('Mentats.Domain.edit', this);
    var id = this.get('id');
    if (id)
      Mentats.editDomain(id);
  }

});

Mentats.DomainsCollection = Backbone.Collection.extend({
  model: Mentats.Domain,
  url: '/j/domaine',

  toJSON: function () {
    return this.pluck('id');
  }

});

Backbone.Model.cache(Mentats.Domain, Mentats.DomainsCollection);

Mentats.DomainsGraph = SVGG.Graph.extend({

  nodeModel: Mentats.Domain,

  initialize: function (options) {
    SVGG.Graph.prototype.initialize.apply(this, arguments);
  }

});
