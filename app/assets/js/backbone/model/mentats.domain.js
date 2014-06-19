
Mentats.Domain = SVGG.Node.extend({

  edit: function () {
    console.log('Mentats.Domain.edit', this);
    Mentats.editDomain(this.get('id'));
  },

});
