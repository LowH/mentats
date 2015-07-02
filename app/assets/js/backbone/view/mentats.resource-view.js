
Mentats.ResourceView = Backbone.View.extend({

  initialize: function (options) {
    _.bindAll(this, 'edit', 'editClose', 'trash');
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);
    this.editDiv = this.$el.find('div.edit');
    this.$el.find('a.edit').click(this.edit);
    this.$el.find('a.trash').click(this.trash);
    this.$el.find('div.edit button.close').click(this.editClose);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  edit: function (evt) {
    this.log('edit', this, evt);
    this.editDiv.show();
    if (evt)
      evt.preventDefault();
  },

  editClose: function (evt) {
    if (evt && evt.preventDefault)
      evt.preventDefault();
    this.editDiv.hide();
  },

  log: debug.logger('Mentats.ResourceView'),

  trash: function (evt) {
    this.log('trash', this, evt);
    if (evt && evt.preventDefault)
      evt.preventDefault();
    if (confirm('Supprimer définitivement cette resource ?')) {
      this.model.destroy({wait: true});
    }
  }

});

$(function () {
  $('.mentats-resource').each(function () {
    var $this = $(this);
    var resource = new Mentats.Resource({
      id: $this.data('id'),
      competence: $this.data('competence'),
      date: $this.data('date'),
      owner: $this.data('owner'),
      text: $this.find('textarea[name=text]').val()
    });
    var view = new Mentats.ResourceView({
      model: resource,
      el: $this
    });
  });
});
