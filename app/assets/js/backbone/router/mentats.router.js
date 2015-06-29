
Mentats.Router = Backbone.Router.extend({

  routes: {
    "classroom/:classroom_id": "classroom",
    "classroom/:classroom_id/:module_id": "classroom",
    "classroom/:classroom_id/:module_id/:domain_id": "classroom"
  },

  classroom: function(classroom_id, module_id, domain_id) {
    console.log('Mentats.router.classroom', classroom_id, module_id, domain_id);
    Mentats.Classroom.find(classroom_id, function (classroom) {
      var view = new Mentats.ClassroomView({
        model: classroom
      });
      if (domain_id)
        Mentats.Domain.find(domain_id, view.domainSelect);
      else if (module_id)
        Mentats.Module.find(module_id, view.moduleSelect);
      Mentats.setBody(view);
    });
  }

});
