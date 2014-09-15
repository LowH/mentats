
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

Backbone.Model.prototype.bindCollection = function (attribute, collectionType, collectionName) {
  collectionType = collectionType || Backbone.Collection;
  collectionName = collectionName || attribute;
  var col = new collectionType(_.map(this.get(attribute),
				     collectionType.prototype.model.find));
  var onCollectionChange = function () {
    this.set(attribute, col.pluck('id'));
  };
  this.listenTo(col, 'add', onCollectionChange);
  this.listenTo(col, 'remove', onCollectionChange);
  this.listenTo(col, 'reset', onCollectionChange);
  this.on('sync', function () {
    col.set(_.map(this.get(attribute),
		  collectionType.prototype.model.find));
  });
  this.collection = this.collection || {};
  this.collection[collectionName] = col;
};
