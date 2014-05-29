
SVGG.Node = Backbone.Model.extend({

  defaults: {
    name: "",
    position: { x: 10, y: 10 },
  },

  initialize: function() {
    this.set({
      requires: new Backbone.Collection(this.get('requires'))
    });
  },

  promptName: function() {
    var n = prompt("Nouveau nom :", this.get('name'));
    if (n)
      this.set({name: n});
  }

});
