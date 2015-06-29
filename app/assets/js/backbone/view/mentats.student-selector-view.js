
Mentats.StudentsSelectorView = Backbone.View.extend({

  events: {
    'click .list-group-item.student': 'onClick'
  },

  initialize: function (options) {
    _.bindAll(this, 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);
    this.$el.addClass('list-group');
    this.listenTo(this.model.available, 'change', this.render);
    this.listenTo(this.model.available, 'add', this.onAdd);
    this.listenTo(this.model.available, 'remove', this.onRemove);
    this.listenTo(this.model.selected, 'add', this.onSelect);
    this.listenTo(this.model.selected, 'remove', this.onDeselect);
    this.listenTo(this.model.selected, 'reset', this.onResetSelection);
  },

  listGroupItem: function (model) {
    this.log('listGroupItem', model);
    return this.$('.list-group-item[data-student="'+model.id+'"]');
  },

  log: debug.logger('Mentats.StudentsSelectorView'),

  onAdd: function (model) {
    this.log('onAdd', arguments);
    var div = this.template(model.toJSON());
    this.$el.append(div);
  },

  onClick: function (evt) {
    this.log('onClick', this, arguments);
    var li = $(evt.currentTarget);
    var m = this.model.available.get(li.data('student'));
    if (li.hasClass('active'))
      this.model.selected.reset();
    else
      this.model.selected.reset([m]);
    //this.model.selected.add(m);
    evt.preventDefault();
  },

  onDeselect: function (model) {
    this.log('onDeselect', arguments);
    this.listGroupItem(model).removeClass('active');
  },

  onRemove: function (model) {
    this.log('onRemove', arguments);
    this.listGroupItem(model).remove();
  },

  onResetSelection: function (models) {
    this.log('onResetSelection', arguments);
    this.$('.list-group-item[data-student]').removeClass('active');
    if (models.length > 0)
      this.listGroupItem(models.at(0)).addClass('active');
  },

  onSelect: function (model) {
    this.log('onSelect', arguments);
    this.listGroupItem(model).addClass('active');
  },

  render: function () {
    var h = this.model.available.map(function (model) {
      return this.template(model);
    }, this).join();
    this.$el.html(h);
  },

  template: _.template($('#students-selector-template').html())

});
