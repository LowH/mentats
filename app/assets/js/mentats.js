
var Mentats = {

  competenceRadius: 15,

  domainRadius: 4,

  editDomain: function(id) {
    document.location = '/domaine/' + id + '/edit';
  },

  editModule: function(id) {
    document.location = '/module/' + id + '/edit';
  },

  viewCompetence: function(id) {
    document.location = '/competence/' + id;
  },

  viewDomain: function(id) {
    document.location = '/domaine/' + id;
  },

  viewModule: function(id) {
    document.location = '/module/' + id;
  },

};
