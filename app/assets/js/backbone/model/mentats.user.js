
Mentats.User = Backbone.Model.extend({

  defaults: {
    name: ""
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
  },

  can: function (action, klass, object) {
    if (!_.isObject(object) && klass.find)
      object = klass.find(object);
    if (this.get('group' == 'admin'))
      return true;
    if (action === 'view') {
      return true;
    }
    else if (action === 'edit') {
      if (klass == Mentats.Classroom)
        if (_.indexOf(object.attributes.teachers, this.id) >= 0)
          return true;
    }
    return false;
  }

});

Mentats.UsersCollection = Backbone.Collection.extend({
  model: Mentats.User,
  url: '/j/user'
});

Backbone.Model.cache(Mentats.User, Mentats.UsersCollection);

$(function () {
  Mentats.sessionUser = Mentats.User.find($('body').data('session-user'));
});
