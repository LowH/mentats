
SVGG.NodeView = Backbone.View.extend({

  events: {
    'mousedown': 'onMouseDown',
    'mouseup': 'onMouseUp',
    'click': 'onClick',
    'dblclick': 'onDblClick'
  },

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onMouseDown', 'onMouseUp', 'onClick', 'onDblClick', 'onMove', 'onChangeLabel', 'onChangeStyle');

    this.paper = options.paper;
    this.group = options.svg.group();
    this.setElement(this.group.node);
    this.group.attr('class', 'node');
    _.forOwn(options.data, function (key, val) {
      this.group.attr('data-' + key, val);
    });
    this.radius = options.radius;
    this.rect = this.group.rect(20, 20)
      .radius(this.radius)
      .fill('#ffffff')
      .stroke('#000000');
    this.label = this.group.plain('')
      .move(12, 0);

    this.listenTo(this.model, 'change:position', this.onMove);
    this.listenTo(this.model, 'change:name', this.onChangeLabel);
    //this.model.on('change:border', this.onChangeStyle);
    //this.model.on('change:background', this.onChangeStyle);

    this.onMove();
    this.onChangeLabel();
    //this.onChangeStyle();
  },

  log: debug.logger('SVGG.NodeView'),

  onMouseDown: function(evt) {
    this.trigger('mousedown', this, evt);
  },

  onMouseUp: function(evt) {
    this.log('onMouseUp', arguments);
    this.trigger('mouseup', this, evt);
  },

  onClick: function(evt) {
    this.trigger('click', this, evt);
  },

  onDblClick: function(evt) {
    this.trigger('dblclick', this, evt);
  },

  onMove: function() {
    var position = this.model.get('position') || { x: 10, y: 10 };
    if (this.x != position.x || this.y != position.y) {
      this.x = position.x;
      this.y = position.y;
      this.group.move(this.x, this.y);
      this.trigger('move', this);
      if (this.paper)
        this.paper.refreshAutocrop();
    }
  },

  resize: function() {
    var bbox = this.label.bbox();
    var g = this.paper ? (2 * this.paper.grid) : 2;
    this.width = Math.ceil((bbox.width + 20) / g) * g;
    this.height = Math.ceil((bbox.height + 8) / g) * g;
    this.rect.size(this.width, this.height);
    this.trigger('resize', this.width, this.height);
    if (this.paper)
      this.paper.refreshAutocrop();
  },

  onChangeLabel: function() {
    this.label.text(this.model.get('name'));
    this.resize();
  },

  onChangeStyle: function() {
    this.rect
      .fill(this.model.get('background'))
      .stroke(this.model.get('border'));
  },

  intersect: function(x, y) {
    var cx = this.x + this.width / 2;
    var cy = this.y + this.height / 2;
    x -= cx;
    y -= cy;
    if (Math.abs(x) < Number.MIN_VALUE)
      return {x: cx, y:(cy + (y > 0 ? 1 : -1) * this.height / 2)};
    var s = x > 0 ? 1 : -1;
    var a = y / x;
    var a1 = this.height / (this.width - 2 * this.radius);
    var a2 = (this.height - 2 * this.radius) / this.width;
    if (a > a1)
      return {x:(cx + s * this.height / 2 / a), y:(cy + s * this.height / 2)};
    else if (a > a2)
      return this.intersectRound(x, y, cx, cy);
    else if (a > -a2)
      return {x:(cx + s * this.width / 2), y:(cy + s * this.width / 2 * a)};
    else if (a > -a1)
      return this.intersectRound(x, y, cx, cy);
    else
      return {x:(cx - s * this.height / 2 / a), y:(cy - s * this.height / 2)};
  },

  intersectRound: function (xd, yd, Cx, Cy) {
    var xc = (xd > 0 ? 1 : -1) * (this.width / 2.0 - this.radius);
    var yc = (yd > 0 ? 1 : -1) * (this.height / 2.0 - this.radius);
    var a = xd * xd + yd * yd;
    var b = 2.0 * (xd * xc + yd * yc);
    var c = xc * xc + yc * yc - this.radius * this.radius;
    var d = b * b - 4 * a * c;
    var t = (b + (b > 0 ? 1 : -1) * Math.sqrt(d)) / (2.0 * a);
    var r = { x: Cx + t * xd, y: Cy + t * yd };
    return r;
  },

  x: 0,

  y: 0

});
