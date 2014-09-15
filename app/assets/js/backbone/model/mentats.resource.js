
Mentats.Resource = Backbone.Model.extend({

  defaults: {
    competence: null,
    date: null,
    owner: null,
    text: null
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/resource/' + this.id;
  }

});

Mentats.ResourcesCollection = Backbone.Collection.extend({
  model: Mentats.Resource,
  url: '/j/resource'
});

Backbone.createCache(Mentats.Resource, Mentats.ResourcesCollection);
