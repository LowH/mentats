
var debug = {};

_.extend(debug, {

  all: false,

  disable: function (tags) {
    var t = (typeof tags == 'string') ? arguments : tags;
    this._tags = _.partial(_.without, this._tags).apply(t);
    return this;
  },

  enable: function (tags) {
    var t = (typeof tags == 'string') ? arguments : tags;
    this._tags = _.partial(_.union, this._tags).apply(t);
    return this;
  },

  tag: function (tags) {
    var t = (typeof tags == 'string') ? arguments : tags;
    if (this.all)
      return t[0];
    return _.find(t, function (x) {
      return _.find(this._tags, x);
    });
  },

  _tags: [],

  tags: function (tags) {
    var t = (typeof tags == 'string') ? arguments : tags;
    return _.intersection(this._tags, t);
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
