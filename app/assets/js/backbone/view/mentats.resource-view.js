
Mentats.ResourceView = Backbone.View.extend({

  initialize: function (options) {
    _.bindAll(this, 'edit', 'editClose', 'trash');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ResourceView', this);
    this.editDiv = this.$el.find('div.edit');
    this.$el.find('a.edit').click(this.edit);
    this.$el.find('a.trash').click(this.trash);
    this.$el.find('div.edit button.close').click(this.editClose);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  edit: function (evt) {
    console.log('Mentats.ResourceView.edit', this, evt);
    this.editDiv.show();
    if (evt)
      evt.preventDefault();
  },

  editClose: function (evt) {
    this.editDiv.hide();
    if (evt)
      evt.preventDefault();
  },

  trash: function (evt) {
    console.log('Mentats.ResourceView.trash', this, evt);
    if (confirm('Supprimer définitivement cette resource ?')) {
      this.model.destroy({wait: true});
    }
    if (evt)
      evt.preventDefault();
  },

});

$(function () {
  $('.mentats-resource').each(function () {
    var $this = $(this);
    var resource = new Mentats.Resource({
      id: $this.data('id'),
      competence: $this.data('competence'),
      date: $this.data('date'),
      owner: $this.data('owner'),
      text: $this.find('textarea[name=text]').val(),
    });
    var view = new Mentats.ResourceView({
      model: resource,
      el: $this,
    });
  });
});
