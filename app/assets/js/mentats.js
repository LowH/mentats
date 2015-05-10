
var Mentats = {

  colors: {
    competence: {
      neutral: '#ffffff',
      validated: '#99ff77',
      open: '#ffee88'
    }
  },

  competenceRadius: 15,

  domainRadius: 4,

  editDomain: function(id) {
    document.location = '/domaine/' + id + '/edit';
  },

  editModule: function(id) {
    document.location = '/module/' + id + '/edit';
  },

  uri: {
    module: function (id, action) {
      id = (id && typeof(id) === 'object') ? id.id : id;
      var u = '/module';
      if (id) {
	u += '/' + id;
	if (action)
	  u += '/' + action;
      }
      return u;
    },

    user: function (id) {
      id = (id && typeof(id) === 'object') ? id.id : id;
      var u = '/user';
      if (id)
	u += '/' + id;
      return u;
    }
  },

  viewCompetence: function(id) {
    document.location = '/competence/' + id;
  },

  viewDomain: function(id) {
    document.location = '/domaine/' + id;
  },

  viewModule: function(id) {
    document.location = '/module/' + id;
  }

};
