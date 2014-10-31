
Mentats.StudentsSelectorView = Backbone.View.extend({

  events: {
    'click .list-group-item.student': 'onClick'
  },

  initialize: function (options) {
    _.bindAll(this, 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.StudentsSelectorView', this);
    this.$el.addClass('list-group');
    this.listenTo(this.model.available, 'add', this.onAdd);
    this.listenTo(this.model.available, 'remove', this.onRemove);
    this.listenTo(this.model.selected, 'add', this.onSelect);
    this.listenTo(this.model.selected, 'remove', this.onDeselect);
  },

  listGroupItem: function (model) {
    return this.$('.list-group-item[data-student="'+model.id+'"]');
  },

  onAdd: function (model) {
    console.log('Mentats.StudentsSelectorView.onAdd', arguments);
    var div = this.template(model.toJSON());
    this.$el.append(div);
  },

  onClick: function (evt) {
    console.log('Mentats.StudentsSelectorView.onClick', this, arguments);
    var li = $(evt.currentTarget);
    var m = this.model.available.get(li.data('student'));
    if (li.hasClass('active'))
      this.model.selected.remove(m);
    else
      this.model.selected.add(m);
    evt.preventDefault();
  },

  onDeselect: function (model) {
    console.log('Mentats.StudentsSelectorView.onDeselect', arguments);
    this.listGroupItem(model).removeClass('active');
  },

  onRemove: function (model) {
    console.log('Mentats.StudentsSelectorView.onRemove', arguments);
    this.listGroupItem(model).remove();
  },

  onSelect: function (model) {
    console.log('Mentats.StudentsSelectorView.onSelect', arguments);
    this.listGroupItem(model).addClass('active');
  },

  render: function () {
    var h = this.model.available.map(_.bind(function (model) {
      return this.template(model);
    })).join();
    this.$el.html(h);
  },

  template: _.template($('#student-selector-template').html())

});
