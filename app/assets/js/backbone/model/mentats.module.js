
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
    this.hasNested('domains', Mentats.DomainsGraph, {
      init: function (domains) {
        domains.module = this;
        domains.url = this.url() + '/domains';
      }
    });
    this.hasOne('owner', Mentats.User, {
      init: function (owner) {
	this.listenTo(owner, 'change', function () {
	  this.trigger('change');
	});
      }
    });
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
