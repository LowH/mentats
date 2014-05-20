Mentats.Graph = joint.dia.Graph.extend({

  initialize: function() {
    var cells = new Mentats.GraphCells;
    this.set('cells', cells);
    cells.on('all', this.trigger, this);
    cells.on('remove', this.removeCell, this);
  },

  /*
  fromJSON: function (json) {
    //console.log(json.cells);
    var options = {add: true, merge: false, remove: false};
    var cells = [];
    _.each(json.cells, function (attrs) {
      //console.log('attrs', attrs);
      var model;
      if (attrs.type == 'Mentats.GraphElement')
	model = new Mentats.GraphElement(attrs, options);
      else if (attrs.type == 'Mentats.graph.Link')
	model = new Mentats.GraphLink(attrs, options);
      if (!model._validate(attrs, options)) {
        console.log('invalid', attrs);
      } else {
	cells.push(model);
      }
    });
    //console.log(cells);
    json.cells = cells;
    return joint.dia.Graph.prototype.fromJSON.apply(this, [json]);
  },
  */

  url: function () {
    return "/competence/id:" + this.id;
  }

});
