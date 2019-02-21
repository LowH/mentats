
Mentats.Router = Backbone.Router.extend({

  routes: {
    "classroom/:classroom": "classroom",
    "classroom/:classroom/:module": "classroom",
    "classroom/:classroom/:module/:domain": "classroom"
  },

  classroom: function(classroom, module, domain) {
    console.log('Mentats.router.classroom', classroom, module, domain);
    var c, m, d;
    var cb = function () {
        if (c && (!module || m) && (!domain || d)) {
        var view = new Mentats.ClassroomView({
          model: c,
          module: m,
          domain: d
        });
        Mentats.setBody(view);
      }
    };
    Mentats.Classroom.find(classroom, function (classroom) {
      c = classroom;
      cb();
    });
    if (module != "edit") {
      Mentats.Module.find(module, function (module) {
        m = module;
        cb();
      });
    }
    Mentats.Domain.find(domain, function (domain) {
      d = domain;
      cb();
    });
  }

});
