
Mentats.CompetenceGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  nodeRadius: 15,

  spawnNode: function(evt) {
    console.log('domain spawn node');
    var node = new Mentats.Competence({
      name: "",
      position: { x: 10, y: 10 }
    });
    node.promptName();
    this.model.get('nodes').add(node, {focus: true});
    if (evt && evt.stopPropagation)
      evt.stopPropagation();
    return node;
  },

  save: function() {
    console.log('Mentats.CompetenceGraphEditor.save', this);
    this.model.save();
  }

});

Mentats.DomainEditor = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.DomainEditor', this);
    this.competenceGraphEditor = new Mentats.CompetenceGraphEditor({
      model: this.model.get('competences'),
      el: '#domain-graph-editor',
      width: 900,
      height: 602,
    });
  },

});
