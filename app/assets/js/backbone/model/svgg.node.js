
SVGG.Node = Backbone.RelationalModel.extend({

  defaults: {
    name: "",
    position: { x: 10, y: 10 }
  },

  promptName: function(save) {
    var n = prompt("Nouveau nom :", this.get('name'));
    if (n) {
      this.set({name: n});
      if (save)
        this.save();
    }
    return n;
  }

});
