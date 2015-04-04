
var debug = {};

_.extend(debug, {

  all: false,

  disable: function (tags) {
    var t = _.isArray(tags) ? tags : arguments;
    this._tags = _.partial(_.without, this._tags)(t);
    return this;
  },

  enable: function (tags) {
    var t = _.isArray(tags) ? tags : arguments;
    this._tags = _.partial(_.union, this._tags)(t);
    return this;
  },

  tag: function (tags) {
    var t = _.isArray(tags) ? tags : arguments;
    if (this.all)
      return t[0];
    var i;
    for (i = 0; i < t.length; i++) {
      var j;
      for (j = 0; j < this._tags.length; j++)
        if (t[i] == this._tags[j])
          return t[i];
    }
    return undefined;
  },

  _tags: [],

  tags: function (tags) {
    var t = _.isArray(tags) ? tags : arguments;
    var i = _.intersection(this._tags, t);
    return i.length == 0 ? false : i;
  },

  log: function (tags, msg) {
    var m = Array.apply(Array, arguments);
    m[0] = this.tag(tags);
    if (m[0])
      console.log.apply(console, m);
  }

});

_.extend(debug, {

  logger: function () {
    var args = _.partial(Array, this.log, this).apply(Array, arguments);
    return _.bind.apply(_, args);
  }

});
