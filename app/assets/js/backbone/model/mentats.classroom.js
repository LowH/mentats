
Mentats.Classroom = Backbone.RelationalModel.extend({

  defaults: {
    level: "",
    modules: [],
    name: "",
    students: [],
    teachers: []
  },

  initialize: function() {
    console.log('new Mentats.Classroom', this, arguments);
    Backbone.RelationalModel.prototype.initialize.apply(this, arguments);
    this.hasMany('modules', Mentats.Module);
    this.hasMany('students', Mentats.Student);
    this.url = '/j/classroom/' + this.id;
  }

});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Backbone.Model.cache(Mentats.Classroom, Mentats.ClassroomsCollection);
