
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
    this.url = '/j/module/' + this.id;
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
  url: '/j/module'
});

Mentats.modules = new Mentats.ModulesCollection;

Mentats.getModule = function (id) {
  var m = Mentats.modules.get(id);
  if (m)
    return m;
  m = new Mentats.Module({id: id});
  m.fetch();
  Mentats.modules.add(m);
  return m;
};
