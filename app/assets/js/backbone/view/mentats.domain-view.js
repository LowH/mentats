
Mentats.DomainView = Backbone.View.extend({

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.DomainView', this);
    this.competenceGraphView = new Mentats.CompetenceGraphView({
      model: this.model.get('competences'),
      el: '#domain-graph-view',
      width: 900,
      height: 602,
    });
  },

});
