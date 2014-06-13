
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

    this.group = options.svg.group();
    this.setElement(this.group.node);
    this.radius = options.radius;
    this.rect = this.group.rect(20, 20)
      .radius(this.radius)
      .fill('#ffffff')
      .stroke('#000000');
    this.label = this.group.plain('')
      .move(12, 0);

    this.model.on('change:position', this.onMove);
    this.model.on('change:name', this.onChangeLabel);
    //this.model.on('change:border', this.onChangeStyle);
    //this.model.on('change:background', this.onChangeStyle);

    this.onMove();
    this.onChangeLabel();
    //this.onChangeStyle();
  },

  onMouseDown: function(evt) {
    this.trigger('mousedown', this, evt);
  },

  onMouseUp: function(evt) {
    this.trigger('mouseup', this, evt);
  },

  onClick: function(evt) {
    this.trigger('click', this, evt);
  },

  onDblClick: function(evt) {
    this.trigger('dblclick', this, evt);
  },

  onMove: function() {
    var position = this.model.get('position');
    if (this.x != position.x || this.y != position.y) {
      this.x = position.x;
      this.y = position.y;
      this.group.move(this.x, this.y);
      this.trigger('move', this);
    }
  },

  resize: function() {
    var bbox = this.label.bbox();
    this.width = Math.floor((bbox.width + 24) / 2) * 2;
    this.height = Math.floor((bbox.height + 16) / 2) * 2;
    this.rect.size(this.width, this.height);
    this.trigger('resize', this.width, this.height);
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
    var s = x > 0 ? 1 : -1;
    var a = Math.abs(x) < Number.MIN_VALUE ? Number.MAX_VALUE : y / x;
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

});
