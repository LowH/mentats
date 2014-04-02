
Mentats.Domain = Backbone.Model.extend({

  defaults: function () {
    return {
      name: "",
      module: null,
      requiredDomains: []
    };
  }

});
