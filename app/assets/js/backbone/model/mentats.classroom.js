
Mentats.Classroom = Backbone.Model.extend({

  defaults: {
    level: "",
    modules: [],
    name: "",
    students: [],
    teachers: [],
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/classroom/' + this.id;
    this.set('modules', new Mentats.ModulesCollection(this.get('modules')));
  },

  parse: function (attrs) {
    this.get('modules').set(_.map(attrs.modules, Mentats.Module.find));
    delete attrs.modules;
    return attrs;
  },
/*
  toJSON: function () {
    var attrs = _.clone(this.attributes);
    if (attrs.modules)
      attrs.modules = attrs.modules.pluck('id');
    return attrs;
  }
*/
});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Backbone.createCache(Mentats.Classroom, Mentats.ClassroomsCollection);
