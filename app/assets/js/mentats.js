
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

  viewCompetence: function(id) {
    document.location = '/competence/' + id;
  },

  viewDomain: function(id) {
    document.location = '/domaine/' + id;
  },

  viewModule: function(id) {
    document.location = '/module/' + id;
  },

  setBody: function (view) {
    console.log('Mentats.setBody', view);
    if (this.body)
      this.body.remove();
    this.body = view;
    view.render().$el.appendTo('#body');
  },

  can: function () {
    this.sessionUser.can.apply(this.sessionUser, arguments);
  }

};
