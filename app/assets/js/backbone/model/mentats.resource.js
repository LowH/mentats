
Mentats.Resource = Backbone.Model.extend({

  defaults: {
    competence: null,
    date: null,
    owner: null,
    text: null,
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/resource/' + this.id;
  },

});

Mentats.ResourcesCollection = Backbone.Collection.extend({
  model: Mentats.Resource,
  url: '/j/resource'
});

Mentats.resources = new Mentats.ResourcesCollection;

Mentats.getResource = function (id) {
  var d = Mentats.resources.get(id);
  if (d)
    return d;
  d = new Mentats.Resource({id: id});
  d.fetch();
  Mentats.resources.add(d);
  return d;
};
