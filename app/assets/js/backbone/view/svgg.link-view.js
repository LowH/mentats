
SVGG.LinkView = Backbone.View.extend({

  events: {
    'mousedown polygon': 'onArrowMouseDown',
  },

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    //_.bindAll(this, 'onMouseDown', 'onMouseUp', 'onClick', 'onDblClick', 'onMove', 'onChangeLabel', 'onChangeStyle');

    this.source = options.source;
    this.target = options.target;

    this.group = options.svg.group();
    this.setElement(this.group.node);

    this.line = this.group.line(0, 0, 0, 0)
      .stroke("#000");
    this.arrow = this.group.polygon('0,0 -5,10 5,10')
      .fill('#000')
      .stroke('none');

    if (this.source.cid)
      this.listenTo(this.source, 'move', this.onMove);
    if (this.target.cid)
      this.listenTo(this.target, 'move', this.onMove);
    this.onMove();
  },

  onArrowMouseDown: function(evt) {
    this.trigger('arrowmousedown', this, evt);
  },

  onMove: function() {
    var x1 = this.source.x + (this.source.width  || 0) / 2;
    var y1 = this.source.y + (this.source.height || 0) / 2;
    var x2 = this.target.x + (this.target.width  || 0) / 2;
    var y2 = this.target.y + (this.target.height || 0) / 2;
    var dx = x2 - x1;
    var dy = y2 - y1;
    var n = Math.sqrt(dx * dx + dy * dy);
    var m = {
      a: 1,  b: 0,
      c: 0,  d: 1,
      e: x2, f: y2
    };
    if (n > Number.MIN_VALUE) {
      m.a = - dy / n;
      m.b =   dx / n;
      m.c = - dx / n;
      m.d = - dy / n;
      if (this.target.intersect) {
	var i = this.target.intersect(x1, y1);
	m.e = i.x;
	m.f = i.y;
      }
    }
    this.arrow.transform(m);
    this.line.plot(x1, y1, m.e, m.f);
  },

  setTarget: function (nodeView) {
    this.target = nodeView;
    this.listenTo(this.target, 'move', this.onMove);
    this.onMove();
  },

});
