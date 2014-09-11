
Mentats.Classroom = Backbone.Model.extend({

  defaults: {
    level: "",
    modules: [],
    name: "",
    students: [],
    teachers: []
  },

  initialize: function() {
    console.log('new Mentats.Classroom', this, arguments);
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/classroom/' + this.id;
    this.set('modules', new Mentats.ModulesCollection(this.get('modules')));
  },

  parse: function (attrs) {
    console.log('Mentats.Classroom.parse', this, arguments);
    var modules = this.get('modules');
    attrs.modules = modules.set(_.map(attrs.modules, Mentats.Module.find));
    return attrs;
  },

  toJSON: function () {
    console.log('Mentats.Classroom.toJSON', this, arguments);
    var attrs = _.clone(this.attributes);
    attrs.modules = _.pluck(attrs.modules, 'id');
    return attrs;
  }

});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Backbone.createCache(Mentats.Classroom, Mentats.ClassroomsCollection);
