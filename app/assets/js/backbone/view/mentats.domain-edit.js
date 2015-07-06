
Mentats.CompetenceGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  log: debug.logger('Mentats.CompetenceGraphEditor'),

  nodeRadius: Mentats.competenceRadius,

  promptName: function (name) {
    return prompt("Nouveau nom :", name || "") || "";
  },

  spawnNode: function(evt, options) {
    this.log('spawnNode');
    if (evt && evt.stopPropagation)
      evt.stopPropagation();
    options = options || {};
    var model = this.model;
    var node = Mentats.Competence.create({
      domain: model.domain.id,
      name: this.promptName(),
      position: { x: 10, y: 10 }
    }, {
      beforeSave: options.beforeSaveNode,
      success: function () {
        model.get('nodes').add(node, {focus: true});
        if (options.beforeSaveGraph)
          options.beforeSaveGraph(model, node);
        model.save();
      }
    });
    return node;
  },

  save: function() {
    this.log('save', this);
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
