
Mentats.Classroom = Backbone.RelationalModel.extend({

  defaults: {
    level: "",
    modules: [],
    name: "",
    students: [],
    teachers: []
  },

  initialize: function() {
    debug.log('Mentats.Classroom', 'new', this, arguments);
    Backbone.RelationalModel.prototype.initialize.apply(this, arguments);
    this.hasMany('modules', Mentats.Module);
    this.hasMany('students', Mentats.Student);
    this.hasMany('teachers', Mentats.User);
  }

});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Backbone.Model.cache(Mentats.Classroom, Mentats.ClassroomsCollection);
