Mentats.GraphLink = joint.dia.Link.extend({

  defaults: joint.util.deepSupplement({
    type: 'Mentats.GraphLink',
    attrs: { '.marker-target': { d: 'M 8 -2 L 0 2 L 8 6 z' },
	     '.line': { 'stroke-width': '3px' } },
    smooth: false
  }, joint.dia.Link.prototype.defaults),

  url: function () {
    return "/competence/link:" + this.id;
  }

});
