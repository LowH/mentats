Mentats.GraphCells = joint.dia.GraphCells.extend({

    model: function(attrs, options) {
      //console.log('model', attrs, options);
      if (attrs.type === 'Mentats.GraphLink') {
        return new Mentats.GraphLink(attrs, options);
      }

      var module = attrs.type.split('.')[0];
      var entity = attrs.type.split('.')[1];
      if (joint.shapes[module] && joint.shapes[module][entity]) {
        return new joint.shapes[module][entity](attrs, options);
      }
      return new Mentats.GraphElement(attrs, options);
    }

});
