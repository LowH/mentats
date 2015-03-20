
Mentats.ClassroomEditView = Backbone.View.extend({

  events: {
    'hide.bs.modal #classroom-modules-selector': 'onHideModulesSelector',
    'submit form': 'onSubmit'
  },

  initialize: function(options) {
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);

    this.listenTo(this.model, 'change:name', this.onChangeName);
    this.listenTo(this.model, 'change:level', this.onChangeLevel);

    var modules = this.model.get('modules');
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

  log: debug.logger('Mentats.ClassroomEditView'),

  onChangeName: function () {
    this.$('.classroom-name').text(this.model.get('name'));
  },

  onChangeLevel: function () {
    this.$('.classroom-level').text(this.model.get('level'));
  },

  onHideModulesSelector: function (modules) {
    this.log('onHideModulesSelector', this);
    this.model.save();
  },

  onModuleAdd: function (module) {
    this.log('onModuleAdd', this);
    var v = new Mentats.ModuleThumbnailView({
      model: module
    }).render();
    this.modulesList.append(v.$el);
  },

  onModuleRemove: function (module) {
    this.log('onModuleRemove', this);
    this.modulesList.children('.module.thumbnail[data-module="'+module.id+'"]').remove();
  },

  onSubmit: function (evt) {
    this.log('onSubmit', this, evt);
    this.model.set({
      name: this.$('input[name="name"]').val(),
      level: this.$('input[name="level"]').val()
    });
    this.model.save();
    evt.preventDefault();
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
