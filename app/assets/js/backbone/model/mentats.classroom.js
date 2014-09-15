
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
    this.bindCollection('modules', Mentats.ModulesCollection);
    //this.bindCollection('students', Mentats.StudentsCollection);
    //this.bindCollection('teachers', Mentats.UsersCollection);
  }

});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Backbone.Model.cache(Mentats.Classroom, Mentats.ClassroomsCollection);
