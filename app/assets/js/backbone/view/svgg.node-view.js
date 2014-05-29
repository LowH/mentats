
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
    this.rect = this.group.rect(20, 20)
      .radius(8)
      .fill('none')
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
    this.group.move(position.x, position.y);
  },

  resize: function() {
    var bbox = this.label.bbox();
    var w = Math.floor((bbox.width + 24) / 2) * 2;
    var h = Math.floor((bbox.height + 16) / 2) * 2;
    this.rect.size(w, h);
    this.trigger('resize', w, h);
		   
  },
    
  onChangeLabel: function() {
    this.label.text(this.model.get('name'));
    this.resize();
  },

  onChangeStyle: function() {
    this.rect
      .fill(this.model.get('background'))
      .stroke(this.model.get('border'));
  }

});
