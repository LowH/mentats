
Mentats.Resource = Backbone.Model.extend({

  defaults: {
    competence: null,
    date: null,
    owner: null,
    text: null
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
  }

});

Mentats.ResourcesCollection = Backbone.Collection.extend({
  model: Mentats.Resource,
  url: '/j/resource'
});

Backbone.Model.cache(Mentats.Resource, Mentats.ResourcesCollection);
