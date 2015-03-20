
Backbone.Model.cache = function (model, collection) {
  model.collection = collection;
  model.cache = new collection;
  model.find = function (id) {
    if (!id)
      return null;
    var obj = model.cache.get(id);
    if (!obj) {
      obj = new model({id: id});
      model.cache.add(obj);
      obj.fetch();
    }
    return obj;
  };
  model.create = function (attrs) {
    var obj = new model(attrs);
    model.cache.add(obj);
    obj.save();
    return obj;
  };
};

Backbone.Relation = function (model, attribute) {
  this.model = model;
  this.attribute = attribute;
  this.initialize.apply(this, arguments);
  if (!model.relations)
    model.relations = {};
  model.relations[attribute] = this;
};

_.extend(Backbone.Relation.prototype, {

  getAttribute: function () {
    try {
      return Backbone.Model.prototype.get.apply(this.model, [this.attribute]);
    }
    catch (e) {
      return undefined;
    }
  },

  setAttribute: function (value) {
    return Backbone.Model.prototype.set.apply(this.model, [this.attribute, value]);
  }

});

_.extend(Backbone.Relation.prototype, {
  get: Backbone.Relation.prototype.getAttribute,
  set: Backbone.Relation.prototype.setAttribute
});

Backbone.Relation.extend = Backbone.Model.extend;

Backbone.RelationHasCollection = Backbone.Relation.extend({

  get: function () {
    return this.related();
  },

  initialize: function (model, attribute, collection, options) {
    this.log('new', model, attribute);
    this.options = options || {};
    this.collection = collection;
  },

  log: debug.logger(['Backbone.RelationHasCollection',
                     'Backbone.cache',
                     'Backbone.Relation']),

  related: function () {
    if (!this.related_value) {
      this.log('related init', this.model, this.attribute);
      this.related_value =
	new this.collection(this.getAttribute());
    }
    return this.related_value;
  },

  set: function (value) {
    if (this.related_value) {
      this.log('set', this, value);
      this.related_value.reset(value);
    }
    else
      this.setAttribute(value);
    return this;
  }

});

Backbone.RelationHasMany = Backbone.Relation.extend({

  get: function () {
    return this.related();
  },

  initialize: function (model, attribute, relatedModel, options) {
    _.bindAll(this, 'update', 'sync');
    this.log('new', attribute, model);
    this.options = options || {};
    this.relatedModel = relatedModel;
    this.collection = (this.options.collection ||
		       this.relatedModel.collection ||
		       Backbone.Collection);
    this.key = this.options.key || 'id';
  },

  log: debug.logger(['Backbone.RelationHasMany',
                     'Backbone.cache',
                     'Backbone.Relation']),

  related: function () {
    if (!this.related_value) {
      this.log('related init', this.model, this.attribute);
      var r = new this.collection(this.relatedModels());
      r.on({
	add: this.update,
	remove: this.update,
	reset: this.update
      });
      this.model.on('sync', this.sync);
      this.related_value = r;
      if (this.options.init)
        this.options.init.call(this.model, r);
    }
    return this.related_value;
  },

  relatedModels: function () {
    return _.map(this.getAttribute() || [], this.relatedModel.find);
  },

  set: function (value) {
    if (this.related_value) {
      this.log('set', this, value);
      if (_.isArray(value) && value.length > 0 && !_.isObject(value[0]))
	value = _.map(value, this.relatedModel.find);
      this.related_value.reset(value);
    }
    else
      this.setAttribute(value);
    return this;
  },

  sync: function () {
    this.log('sync', this, this.getAttribute());
    if (this.related_value)
      this.related_value.set(this.relatedModels());
  },

  update: function () {
    this.log('update', this, this.related().pluck(this.key));
    this.setAttribute(this.related().pluck(this.key));
  }

});

Backbone.RelationHasNested = Backbone.Relation.extend({

  get: function () {
    return this.related();
  },

  initialize: function (model, attribute, relatedModel, options) {
    _.bindAll(this, 'update', 'sync');
    this.log('new', attribute, model);
    this.options = options || {};
    this.relatedModel = relatedModel;
  },

  log: debug.logger(['Backbone.RelationHasNested',
                     'Backbone.cache',
                     'Backbone.Relation']),

  related: function () {
    if (!this.related_value) {
      this.log('related init', this.model, this.attribute);
      var a = this.getAttribute();
      var r = (this.relatedModel.create ? this.relatedModel.create(a)
	       : new this.relatedModel(a));
      if (this.options.init)
	this.options.init.call(this.model, r);
      r.on('change', this.update);
      this.model.on('sync', this.sync);
      this.related_value = r;
    }
    return this.related_value;
  },

  set: function (value) {
    if (this.related_value) {
      this.log('set', this, value);
      this.related_value.set(value);
    }
    else
      this.setAttribute(value);
    return this;
  },

  sync: function () {
    this.log('sync', this, this.getAttribute());
    if (this.related_value)
      this.related_value.set(this.getAttribute());
  },

  update: function () {
    this.log('update', this, this.related().toJSON());
    this.setAttribute(this.related().toJSON());
  }

});

Backbone.RelationHasOne = Backbone.Relation.extend({

  get: function () {
    return this.related();
  },

  initialize: function (model, attribute, relatedModel, options) {
    _.bindAll(this, 'update', 'sync');
    this.log('new', attribute, model);
    this.options = options || {};
    this.relatedModel = relatedModel;
    this.key = this.options.key || 'id';
    this.model.on('sync', this.sync);
  },

  log: debug.logger(['Backbone.RelationHasOne',
                     'Backbone.cache',
                     'Backbone.Relation']),

  related: function () {
    if (!this.related_value) {
      this.log('related init', this.attribute, this.model);
      var r = this.relatedModel.find(this.getAttribute());
      if (r) {
	if (this.options.init)
	  this.options.init.call(this.model, r);
        r.on('change:' + this.key, this.update);
      }
      this.related_value = r;
    }
    return this.related_value;
  },

  set: function (value) {
    if (this.related_value) {
      this.log('set', this, value);
      this.related_value.off('change:' + this.key, this.update);
      this.related_value = null;
      this.related();
    }
    else
      this.setAttribute(value);
    return this;
  },

  sync: function () {
    this.log('sync', this, this.getAttribute());
    if (this.related_value)
      this.related_value.set(this.getAttribute());
  },

  update: function () {
    this.log('update', this, this.related_value[this.key]);
    this.setAttribute(this.related_value[this.key]);
  }

});

Backbone.RelationalModel = Backbone.Model.extend({

  get: function (attr) {
    if (this.relations) {
      var rel = this.relations[attr];
      if (rel)
        return rel.get();
    }
    return Backbone.Model.prototype.get.apply(this, arguments);
  },

  getAttributes: function () {
    var attrs = _.clone(this.attributes);
    var attr;
    for (attr in attrs)
      attrs[attr] = this.get(attr);
    return attrs;
  },

  hasCollection: function (attribute, collection, options) {
    new Backbone.RelationHasCollection(this, attribute, collection, options);
  },

  hasMany: function (attribute, model, options) {
    new Backbone.RelationHasMany(this, attribute, model, options);
  },

  hasNested: function (attribute, model, options) {
    new Backbone.RelationHasNested(this, attribute, model, options);
  },

  hasOne: function (attribute, model, options) {
    new Backbone.RelationHasOne(this, attribute, model, options);
  },

  initialize: function () {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.relations = {};
  },

  relations: {},

  set: function (key, val, options) {
    debug.log('Backbone.RelationalModel', 'set', this, key, val, options);
    Backbone.Model.prototype.set.apply(this, arguments);
    if (this.relations) {
      var attr, attrs;
      if (key == null) return this;
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }
      for (attr in attrs) {
        var rel = this.relations[attr];
        if (rel)
	  rel.set(attrs[attr]);
      }
    }
    return this;
  },

  super_get: Backbone.Model.prototype.get,

  super_set: Backbone.Model.prototype.set

});
