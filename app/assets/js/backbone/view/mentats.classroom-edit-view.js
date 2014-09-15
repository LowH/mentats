
Mentats.ClassroomEditView = Backbone.View.extend({

  events: {
    'hide.bs.modal #classroom-modules-selector': 'onHideModulesSelector'
  },

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ClassroomEditView', this);
    var modules = this.model.collection.modules;
    this.listenTo(modules, 'add', this.onModuleAdd);
    this.listenTo(modules, 'remove', this.onModuleRemove);
    this.modulesList = this.$('.classroom-modules-list');

    Mentats.Module.cache.fetch();
    this.moduleSelector = new Mentats.ModulesSelectorView({
      el: this.$('.modules-selector ul.modules-list'),
      model: {
	available: Mentats.Module.cache,
	selected: modules
      }
    }).render();
  },

  onHideModulesSelector: function (modules) {
    console.log('Mentats.ClassroomEditView.onHideModulesSelector', this);
    this.model.save();
  },

  onModuleAdd: function (module) {
    console.log('Mentats.ClassroomEditView.onModuleAdd', this);
    var v = new Mentats.ModuleThumbnailView({
      model: module
    }).render();
    this.modulesList.append(v.$el);
  },

  onModuleRemove: function (module) {
    console.log('Mentats.ClassroomEditView.onModuleAdd', this);
    this.modulesList.children('.module.thumbnail[data-module="'+module.id+'"]').remove();
  }

});

$(function () {
  $('body.classroom--edit').each(function () {
    var c = Mentats.Classroom.find($('#edit-classroom').data('classroom'));
    var v = new Mentats.ClassroomEditView({
      el: $('body'),
      model: c
    });
  });
});
