
Mentats.DomainsGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.domainRadius,

  initialize: function (options) {
    console.log('new Mentats.DomainsGraphView', options);
    this.nodeEvents = {
      click: options.onNodeClick || this.onNodeClick
    };
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.$el.addClass('domains-graph').attr('data-module', options.module.id);
  },

  onNodeClick: function (node, evt) {
    console.log('Mentats.DomainsGraphView.onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewDomain(node.model.get('id'));
      evt.stopPropagation();
    }
  }

});

Mentats.domainsGraph = function () {
  var $this = $(this);
  var module = Mentats.Module.find($this.data('module'));
  var view = new Mentats.DomainsGraphView({
    model: module.get('domains'),
    module: module,
    el: this,
    autocrop: true
  });
  console.log(view);
};

$(function () {
  $('.domains-graph').each(Mentats.domainsGraph);
});
