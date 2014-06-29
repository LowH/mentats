
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

  edit: function () {
    console.log('Mentats.ResourceView.edit', this);
    this.editDiv.show();
  },

  editClose: function () {
    this.editDiv.hide();
  },

  trash: function () {
    console.log('Mentats.ResourceView.trash', this);
    if (confirm('Supprimer définitivement cette resource ?')) {
      this.model.destroy({wait: true});
    }
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
