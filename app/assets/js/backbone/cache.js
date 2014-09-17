
Backbone.Model.cache = function (model, collection) {
  model.collection = collection;
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

Backbone.RelationalModel = Backbone.Model.extend({

  get: function (attr) {
    var rel = this.relations[attr];
    if (rel) {
      if (rel.hasMany)
	return this.relations[attr].collection;
    }
    return Backbone.Model.prototype.get.apply(this, arguments);
  },

  hasMany: function (attribute, model, options) {
    options = options || {};
    var get = _.bind(Backbone.Model.prototype.get, this);
    var set = _.bind(Backbone.Model.prototype.set, this);
    var rel = {
      attribute: attribute,
      hasMany: options.collection || model.collection || Backbone.Collection,
      key: options.key || 'id',
      model: model
    };
    rel.collection = new rel.hasMany(_.map(get(attribute) || [],
					   model.find));
    var update = function () {
      set(attribute, rel.collection.pluck(rel.key));
    };
    this.listenTo(rel.collection, 'add', update);
    this.listenTo(rel.collection, 'remove', update);
    this.listenTo(rel.collection, 'reset', update);
    this.on('sync', function () {
      rel.collection.set(_.map(get(attribute) || [], model.find));
    });
    this.relations[attribute] = rel;
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
  },

  set: function (attr, value) {
    var rel = this.relations[attr];
    if (rel) {
      if (rel.hasMany)
	return this.relations[attr].collection.set(value);
    }
    return Backbone.Model.prototype.set.apply(this, arguments);
  },

  relations: {}

});
