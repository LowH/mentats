
Mentats.DomainsCollection = Backbone.Collection.extend({
  model: Mentats.Domain,
  url: '/domain'
});

Mentats.DomainsGraph = SVGG.Graph.extend({

  initialize: function() {
    _.bindAll(this, 'link');
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.set({
      nodes: new Mentats.DomainsCollection(this.get('nodes')),
      links: new Backbone.Collection(this.get('links'))
    });
  },

  parse: function(attr, options) {
    console.log('DomainsGraph.parse', attr, options);
    this.get('nodes').reset(attr.nodes);
    this.get('links').reset(attr.links);
    return {};
  },


});

Mentats.Module = Backbone.Model.extend({

  defaults: {
    discipline: "",
    level: "",
    version: 0,
    owner: null,
    description: "",
    domains: {nodes: [], links: []}
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/module/' + this.id;
    this.set('domains', new Mentats.DomainsGraph(this.get('domains')));
    this.get('domains').url = this.url + '/domains';
  },

  parse: function(attr, options) {
    console.log('Module.parse', attr, options);
    var domains = this.get('domains');
    domains.set(domains.parse(attr.domains, options));
    delete attr.domains;
    return attr;
  }

});

Mentats.ModulesCollection = Backbone.Collection.extend({
  model: Mentats.Module,
  url: '/module'
});
