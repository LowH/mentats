
Mentats.DomainsGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.domainRadius,

  initialize: function (options) {
    debug.log('Mentats.DomainsGraphView', 'new', options);
    this.nodeEvents = {
      click: options.onNodeClick || this.onNodeClick
    };
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.$el.addClass('domains-graph').attr('data-module', options.module.id);
  },

  onNodeClick: function (node, evt) {
    debug.log('Mentats.DomainsGraphView', 'onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewDomain(node.model.get('id'));
      evt.stopPropagation();
    }
  }

});

Mentats.domainsGraph = function () {
  try {
    var $this = $(this);
    var module = Mentats.Module.find($this.data('module'));
    var view = new Mentats.DomainsGraphView({
      model: module.get('domains'),
      module: module,
      el: this,
      autocrop: true
    });
    debug.log('Mentats.domainsGraph', view);
  }
  catch (e) {
    debug.log('Mentats.domainsGraph', e);
  }

};

$(function () {
  $('.domains-graph').each(Mentats.domainsGraph);
});
