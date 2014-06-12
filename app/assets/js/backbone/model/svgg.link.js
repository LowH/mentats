
SVGG.Link = Backbone.Model.extend({

  defaults: {
    source: null,
    target: null
  }

});

SVGG.LinksCollection = Backbone.Collection.extend({
  model: SVGG.Link
});
