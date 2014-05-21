
SVGG.Node = Backbone.Model.extend({

  defaults: function () {
    return {
      label: "",
      position: { x: 10, y: 10 },
      border: "#000",
      background: "#fff"
    };
  },

  promptLabel: function() {
    var n = prompt("Nouveau nom :", this.get('label'));
    if (n)
      this.set({label: n});
  }

});
