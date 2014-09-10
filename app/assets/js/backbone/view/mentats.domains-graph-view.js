
Mentats.DomainsGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.domainRadius,

  initialize: function (options) {
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    this.nodeEvents = {
      click: this.onNodeClick,
    };
  },

  onNodeClick: function (node, evt) {
    console.log('Mentats.DomainsGraphView.onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewDomain(node.model.get('id'));
      evt.stopPropagation();
    }
  },

});

Mentats.domainsGraph = function () {
  var $this = $(this);
  var module = Mentats.Module.find($this.data('module'));
  var view = new Mentats.DomainsGraphView({
    model: module.get('domains'),
    el: this,
    autocrop: true,
  });
  console.log(view);
};

$(function () {
  $('.domains-graph').each(Mentats.domainsGraph);
});
