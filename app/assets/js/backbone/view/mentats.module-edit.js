
Mentats.DomainGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  log: debug.logger('Mentats.DomainGraphEditor'),

  nodeRadius: Mentats.domainRadius,

  promptName: function (name) {
    return prompt("Nouveau nom :", name || "") || "";
  },

  spawnNode: function(evt, options) {
    this.log('spawnNode');
    if (evt && evt.stopPropagation)
      evt.stopPropagation();
    options = options || {};
    var model = this.model;
    var node = Mentats.Domain.create({
      module: model.module.id,
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

Mentats.ModuleEditor = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    debug.log('Mentats.ModuleEditor', 'new', this);
    this.domainGraphEditor = new Mentats.DomainGraphEditor({
      model: this.model.get('domains'),
      module: this,
      el: '#module-graph-editor',
      width: 900,
      height: 602
    });
  }

});
