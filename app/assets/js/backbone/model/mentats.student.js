
Mentats.Student = Backbone.RelationalModel.extend({

  defaults: {
    name: null
  },

  initialize: function() {
    debug.log('Mentats.Student', 'new', this, arguments);
    Backbone.RelationalModel.prototype.initialize.apply(this, arguments);
    this.url = '/j/student/' + this.id;
  }

});

Mentats.StudentsCollection = Backbone.Collection.extend({
  model: Mentats.Student,
  url: '/j/student'
});

Backbone.Model.cache(Mentats.Student, Mentats.StudentsCollection);
