
Mentats.ClassroomView = Backbone.View.extend({

  deselectModule: function () {
    if (this.module) {
      this.$('.modules.panel .list-group-item.module').removeClass('active');
      this.$('.main').html('');
      this.module = null;
    }
  },

  events: {
    'click .list-group-item.module': 'onModulesListClick'
  },

  initialize: function(options) {
    _.bindAll(this, 'onDomainClick');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ClassroomView', this);
    //this.selectModule(this.model.get('modules').sample());
    this.module = null;
  },

  moduleListItem: function (module) {
    return this.$('.modules.panel .list-group-item.module[data-module="'
		  + module.id + '"]');
  },

  onDomainClick: function (node, evt) {
    console.log('Mentats.ClassroomView.onDomainClick', this, evt);
    if (evt.button == 0) {
      var domain = Mentats.Domain.find(node.model.get('id'));
      var div = $('<div></div>');
      this.$('.main').html('').append(div);
      var v = new Mentats.CompetencesGraphView({
	domain: domain,
	el: div,
	model: domain.get('competences'),
	autocrop: true
      });
      this.mainView = v;
      evt.stopPropagation();
    }
  },

  onModulesListClick: function (evt) {
    console.log('Mentats.ClassroomView.onModuleAdd', this);
    this.selectModule(Mentats.Module.find($(evt.currentTarget).data('module')));
    evt.preventDefault();
  },

  selectModule: function (module) {
    console.log('Mentats.ClassroomView.selectModule', this, module);
    if (!module)
      return;
    var domains = module.get('domains');
    if (!domains)
      return;
    this.deselectModule();
    var div = $('<div></div>');
    this.$('.main').html('').append(div);
    var v = new Mentats.DomainsGraphView({
      el: div,
      model: domains,
      module: module,
      onNodeClick: this.onDomainClick,
      autocrop: true
    });
    this.mainView = v;
    this.module = module;
    this.moduleListItem(module).addClass('active');
  }

});

$(function () {
  $('body.classroom--show').each(function () {
    var c = Mentats.Classroom.find($('h1[data-classroom]').data('classroom'));
    var v = new Mentats.ClassroomView({
      el: $('body'),
      model: c
    });
  });
});
