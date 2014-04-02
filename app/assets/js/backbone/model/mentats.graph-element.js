Mentats.GraphElement = joint.dia.Element.extend({

  markup: ('<rect class="focus box" rx="5" ry="5"/>' +
	   '<rect class="main box" rx="5" ry="5"/>' +
	   '<text class="name"/>' +
	   '<circle class="focus link btn" r="4" />'),

  defaults: joint.util.deepSupplement({
    name: '',
    type: 'Mentats.graph.Element',
    attrs: {
      '.main.box': { fill: '#FFFFFF',
		     stroke: 'black',
		     'stroke-width': 1 },
      '.box': { width: 1, height: 1 },
      'circle.btn': { 'ref-dx': -5,
		      'ref-dy': -5,
		      ref: '.main.box',
		      'y-alignment': 1,
		      'x-alignment': 1 },
      '.name': { 'font-size': 14,
		 text: '',
		 'ref-x': .5,
		 'ref-y': .54,
		 ref: '.main.box',
		 'y-alignment': 'middle',
		 'x-alignment': 'middle' }
    }
  }, joint.dia.Element.prototype.defaults),

  initialize: function () {
    _.bindAll(this, 'promptName');
    joint.dia.Element.prototype.initialize.apply(this, arguments);
    this.on({
      'change:name': this.typeset
    });
    this.typeset();
  },

  typeset: function () {
    var text = this.get('name');
    var maxLineLength = _.max(text.split('\n'), function(l) { return l.length; }).length;
    var letterSize = 14;
    var snap = 2 * 5;
    var width = Math.ceil((letterSize * (0.6 * (maxLineLength + 2))) / snap) * snap;
    var height = Math.ceil(((text.split('\n').length + 1) * letterSize) / snap) * snap;

    var attrs = joint.util.deepSupplement({
      '.box': { width: width, height: height },
      '.name': { text: text },
    }, this.get('attrs'));

    this.set({
      size: { width: width, height: height },
      attrs: attrs
    });
  },

  promptName: function () {
    var n = prompt("Nouveau nom :", this.get('name'));
    if (n)
      this.set({name: n});
  },

  url: function () {
    return "/competence/id:" + this.id;
  }

});
