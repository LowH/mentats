
Mentats.Student = Backbone.RelationalModel.extend({

  defaults: {
    name: null,
    competences: []
  },

  addCompetence: function (competence) {
    if (_.isObject(competence))
      competence = competence.id;
    this.set('competences', _.union(this.get('competences'), [competence]));
    console.log('add competence', competence, this.get('competences'));
  },

  hasCompetence: function (competence) {
    if (_.isObject(competence))
      competence = competence.id;
    return _.indexOf(this.get('competences'), competence) >= 0;
  },

  removeCompetence: function (competence) {
    console.log('remove competence');
    if (_.isObject(competence))
      competence = competence.id;
    this.set('competences', _.difference(this.get('competences'), [competence]));
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
