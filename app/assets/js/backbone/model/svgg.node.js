
SVGG.Node = Backbone.Model.extend({

  defaults: {
    name: "",
    position: { x: 10, y: 10 }
  },

  promptName: function() {
    var n = prompt("Nouveau nom :", this.get('name'));
    if (n)
      this.set({name: n});
  }

});
