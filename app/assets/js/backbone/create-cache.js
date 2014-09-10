
Backbone.createCache = function (model, collection) {
  model.cache = new collection;
  model.find = function (id) {
    if (!id)
      return null;
    var obj = model.cache.get(id);
    if (!obj) {
      obj = new model({id: id});
      obj.fetch();
      model.cache.add(obj);
    }
    return obj;
  };
};
