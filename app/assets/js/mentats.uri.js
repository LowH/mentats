
Mentats.uri = {

  id: function (x) {
    return _.isObject(x) ? x.id : x;
  },

  classroom: function (id, action_or_module, domain) {
    var u = '/classroom';
    if (id) {
      u += '/' + this.id(id);
      if (action_or_module) {
        u = u + '/' + this.id(action_or_module);
        if (domain)
          u = u + '/' + this.id(domain);
      }
    }
    return u;
  },

  module: function (id, action) {
    var u = '/module';
    if (id) {
      u += '/' + this.id(id);
      if (action)
	u += '/' + action;
    }
    return u;
  },

  user: function (id) {
    var u = '/user';
    if (id)
      u += '/' + this.id(id);
    return u;
  }

};
