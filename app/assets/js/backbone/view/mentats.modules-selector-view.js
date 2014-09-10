
Mentats.ModulesSelectorView = Backbone.View.extend({

  events: {
    'click li': 'onClick'
  },

  initialize: function (options) {
    _.bindAll(this, 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModulesSelectorView', this);
    this.$el.addClass('list-group');
    this.listenTo(this.model.available, 'add', this.onAdd);
    this.listenTo(this.model.available, 'remove', this.onRemove);
    this.listenTo(this.model.selected, 'add', this.onSelect);
    this.listenTo(this.model.selected, 'remove', this.onDeselect);
  },

  onAdd: function (module) {
    console.log('Mentats.ModulesSelectorView.onAdd', arguments);
    var v = new Mentats.ModuleThumbnailView({
      model: module
    }).render();
    var li = $(this.template(module.attributes));
    li.prepend(v.$el);
    if (this.model.selected.get(module.id))
      li.addClass('active');
    this.$el.append(li);
  },

  onClick: function (evt) {
    console.log('Mentats.ModulesSelectorView.onClick', this, arguments);
    var li = $(evt.currentTarget);
    var m = this.model.available.get(li.data('module'));
    if (li.hasClass('active'))
      this.model.selected.remove(m);
    else
      this.model.selected.add(m);
    evt.preventDefault();
  },

  onDeselect: function (module) {
    console.log('Mentats.ModulesSelectorView.onSelect', arguments);
    var li = this.$('li[data-module="'+module.id+'"]');
    li.removeClass('active');
  },

  onRemove: function (module) {
    console.log('Mentats.ModulesSelectorView.onRemove', arguments);
    var li = this.$('li[data-module="'+module.id+'"]');
    li.parent().remove();
  },

  onSelect: function (module) {
    console.log('Mentats.ModulesSelectorView.onSelect', arguments);
    var li = this.$('li[data-module="'+module.id+'"]');
    li.addClass('active');
  },

  template: _.template($('#modules-selector-template').html())

});
