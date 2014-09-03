
Mentats.User = Backbone.Model.extend({

  defaults: {
    name: "",
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/user/' + this.id;
  },

});

Mentats.UsersCollection = Backbone.Collection.extend({
  model: Mentats.User,
  url: '/j/user'
});

Mentats.users = new Mentats.UsersCollection;

Mentats.getUser = function (id) {
  if (!id)
    return null;
  var u = Mentats.users.get(id);
  if (u)
    return u;
  u = new Mentats.User({id: id});
  u.fetch();
  Mentats.users.add(u);
  return u;
};

$(function () {
  Mentats.sessionUser = Mentats.getUser($('body').data('session-user'));
});
