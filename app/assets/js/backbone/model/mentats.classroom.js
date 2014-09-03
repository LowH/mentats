
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
  },

});

Mentats.ClassroomsCollection = Backbone.Collection.extend({
  model: Mentats.Classroom,
  url: '/j/classroom'
});

Mentats.classrooms = new Mentats.ClassroomsCollection;

Mentats.getClassroom = function (id) {
  if (!id)
    return null;
  var c = Mentats.classrooms.get(id);
  if (c)
    return c;
  c = new Mentats.Classroom({id: id});
  c.fetch();
  Mentats.classrooms.add(c);
  return c;
};
