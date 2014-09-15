
Mentats.User = Backbone.Model.extend({

  defaults: {
    name: ""
  },

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.url = '/j/user/' + this.id;
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
