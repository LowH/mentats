
Mentats.CompetenceGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  nodeRadius: Mentats.competenceRadius,

  spawnNode: function(evt) {
    debug.log('Mentats.CompetenceGraphEditor', 'spawnNode');
    var node = Mentats.Competence.create({
      name: "",
      position: { x: 10, y: 10 }
    });
    node.promptName();
    node.save();
    this.model.get('nodes').add(node, {focus: true});
    this.model.save();
    if (evt && evt.stopPropagation)
      evt.stopPropagation();
    return node;
  },

  save: function() {
    debug.log('Mentats.CompetenceGraphEditor', 'save');
    this.model.save();
  }

});

Mentats.DomainEditor = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    debug.log('Mentats.DomainEditor', this);
    this.competenceGraphEditor = new Mentats.CompetenceGraphEditor({
      domain: this,
      model: this.model.get('competences'),
      el: '#domain-graph-editor',
      width: 900,
      height: 602
    });
  }

});
