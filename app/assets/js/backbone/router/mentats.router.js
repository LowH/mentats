
Mentats.Router = Backbone.Router.extend({

  routes: {
    "classroom/:classroom": "classroom",
    "classroom/:classroom/:module": "classroom",
    "classroom/:classroom/:module/:domain": "classroom",
    "classroom/:classroom/:module/:domain/:student": "classroom"
  },

  classroom: function(classroom, module, domain, student) {
    console.log('Mentats.router.classroom', classroom, module, domain, student);
    var c, m, d, s;
    var cb = function () {
      if (c && (!module || m) && (!domain || d) && (!student || s)) {
        var view = new Mentats.ClassroomView({
          model: c,
          module: m,
          domain: d,
          student: s
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
    Mentats.Student.find(student, function (student) {
      s = student;
      cb();
    });
  }

});
