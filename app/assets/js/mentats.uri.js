
Mentats.uri = {

  classroom: function (id, action_or_module, domain) {
    if (_.isObject(id))
      id = id.id;
    var u = '/classroom';
    if (id) {
      u += '/' + id;
      if (action_or_module) {
        u = u + '/' + action_or_module;
        if (domain)
          u = u + '/' + domain;
      }
    }
    return u;
  },

  module: function (id, action) {
    if (_.isObject(id))
      id = id.id;
    var u = '/module';
    if (id) {
      u += '/' + id;
      if (action)
	u += '/' + action;
    }
    return u;
  },

  user: function (id) {
    if (_.isObject(id))
      id = id.id;
    var u = '/user';
    if (id)
      u += '/' + id;
    return u;
  }

};
