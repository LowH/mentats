
Mentats.ClassroomView = Backbone.View.extend({

  deselectModule: function () {
    if (this.module) {
      this.$('.modules.panel .list-group-item.module').removeClass('active');
      this.$('.main, .main-sub').html('');
      this.module = null;
    }
  },

  events: {
    'click .list-group-item.module': 'onModulesListClick'
  },

  initialize: function(options) {
    _.bindAll(this, 'onCompetenceClick', 'onDomainClick');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ClassroomView', this);
    this.studentsView = new Mentats.StudentsSelectorView({
      el: $('.students .list-group')[0],
      model: {
	available: this.model.get('students'),
	selected: new Mentats.StudentsCollection
      }
    });
    this.module = null;
    this.listenTo(this.model.get('modules'), 'change', this.onModulesChange);
  },

  moduleListItem: function (module) {
    return this.$('.modules.panel .list-group-item.module[data-module="'
		  + module.id + '"]');
  },

  onCompetenceClick: function (node, evt) {
    console.log('Mentats.ClassroomView.onCompetenceClick', this, node, evt);
    if (evt.button == 0) {
      this.selectCompetence(node);
      evt.stopPropagation();
    }
  },

  onDomainClick: function (node, evt) {
    console.log('Mentats.ClassroomView.onDomainClick', this, node, evt);
    if (evt.button == 0) {
      var domain = Mentats.Domain.find(node.model.get('id'));
      var div = $('<div></div>');
      this.$('.main').html('').append(div);
      var v = new Mentats.CompetencesGraphView({
	domain: domain,
	el: div,
	model: domain.get('competences'),
	onNodeClick: this.onCompetenceClick,
	autocrop: true
      });
      this.mainView = v;
      v.$el.click(_.bind(function () {
	this.selectCompetence(null);
      }, this));
      evt.stopPropagation();
    }
  },

  onModulesChange: function () {
    console.log('Mentats.ClassroomView.onModulesChange', this, arguments);
    if (!this.module)
      this.selectModule(this.model.get('modules').at(0));
  },

  onModulesListClick: function (evt) {
    console.log('Mentats.ClassroomView.onModulesListClick', this);
    this.selectModule(Mentats.Module.find($(evt.currentTarget).data('module')));
    evt.preventDefault();
  },

  selectCompetence: function (competence) {
    console.log('Mentats.ClassroomView.selectCompetence', this, competence);
    this.mainView.setFocus(competence);
    this.$('.main-sub').html('');
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
