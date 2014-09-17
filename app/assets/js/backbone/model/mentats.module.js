
Mentats.Module = Backbone.RelationalModel.extend({

  defaults: {
    backgroundImage: "\/assets\/module\/default-cover.png",
    can: {},
    discipline: "",
    level: "",
    version: 0,
    owner: null,
    description: "",
    domains: {nodes: [], links: []},
    inLibrary: false,
    classrooms: []
  },

  initialize: function() {
    Backbone.RelationalModel.prototype.initialize.apply(this, arguments);
    this.hasMany('classrooms', Mentats.Classroom);
    this.url = '/j/module/' + this.id;
    this.set('domains', new Mentats.DomainsGraph(this.get('domains')));
    this.get('domains').url = this.url + '/domains';
    var owner = Mentats.User.find(this.get('owner'));
    if (owner) {
      this.set('owner', owner);
      this.listenTo(owner, 'change', function () { this.trigger('change'); });
    }
  },

  parse: function(attr, options) {
    console.log('Module.parse', attr, options);
    var domains = this.get('domains') || new Mentats.DomainsGraph(this.get('domains'));
    domains.set(domains.parse(attr.domains, options));
    delete attr.domains;
    if ((attr.owner = Mentats.User.find(attr.owner)))
      this.listenTo(attr.owner, 'change', function () { this.trigger('change'); });
    return attr;
  }

});

Mentats.ModulesCollection = Backbone.Collection.extend({
  model: Mentats.Module,
  url: '/j/module',

  toJSON: function () {
    return this.pluck('id');
  }

});

Backbone.Model.cache(Mentats.Module, Mentats.ModulesCollection);
