
Mentats.Module = Backbone.Model.extend({

  defaults: function () {
    return {
      discipline: "",
      level: "",
      version: "",
      owner: null,
      deleted: false,
      description: ""
    };
  }

});
