
Mentats.DomainGraphEditor = SVGG.Editor.extend({

  initialize: function(options) {
    SVGG.Editor.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'spawnNode', 'save');
  },

  nodeRadius: Mentats.domainRadius,

  spawnNode: function(evt) {
    console.log('module spawn node');
    var node = Mentats.Domain.create({
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
    console.log('Mentats.DomainGraphEditor.save', this);
    this.model.get('nodes').each(function (node) {
      node.save();
    });
    this.model.save();
  }

});

Mentats.ModuleEditor = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModuleEditor', this);
    this.domainGraphEditor = new Mentats.DomainGraphEditor({
      model: this.model.get('domains'),
      module: this,
      el: '#module-graph-editor',
      width: 900,
      height: 602
    });
  }

});
