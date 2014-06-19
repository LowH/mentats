
Mentats.DomainGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  nodeRadius: Mentats.domainRadius,

  spawnNode: function(evt) {
    console.log('module spawn node');
    var node = new Mentats.Domain({
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
    console.log('Mentats.DomainGraphEditor.save', this);
    this.model.save();
  }

});

Mentats.ModuleEditor = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModuleEditor', this);
    this.domainGraphEditor = new Mentats.DomainGraphEditor({
      model: this.model.get('domains'),
      el: '#module-graph-editor',
      width: 900,
      height: 602,
    });
  },

});
