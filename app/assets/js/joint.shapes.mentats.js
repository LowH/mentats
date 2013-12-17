joint.shapes.mentats = {};

joint.shapes.mentats.Competence = joint.dia.Element.extend({

  markup: '<rect/><text/>',

  defaults: joint.util.deepSupplement({

    type: 'mentats.Competence',
    attrs: {
      'rect': { fill: '#FFFFFF', stroke: 'black', width: 1, height: 1 },
      'text': { 'font-size': 14, text: '', 'ref-x': .5, 'ref-y': .54, ref: 'rect',
		'y-alignment': 'middle', 'x-alignment': 'middle', fill: 'black',
		'font-family': 'monospace' }
    }

  }, joint.dia.Element.prototype.defaults)

});
