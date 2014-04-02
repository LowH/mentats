Mentats.GraphLinkView = joint.dia.LinkView.extend({

  options: joint.util.deepSupplement({
    shortLinkLength: 50
  }, joint.dia.LinkView.prototype.options),

  /*
  initialize: function() {
    joint.dia.LinkView.prototype.initialize.apply(this, arguments);
    console.log('linkview.initialize', this.$el.data('view'));
  },

  pointerdown: function(evt) {
    console.log('linkview.pointerdown', arguments);
    joint.dia.LinkView.prototype.pointerdown.apply(this, arguments);
  },
  */

  pointerup: function(evt) {
    joint.dia.LinkView.prototype.pointerup.apply(this, arguments);
    var target = this.model.get('target');
    if (!target.id || this.model.get('source').id === target.id) {
      //console.log('remove', this.model);
      this.model.remove();
    }
    // FIXME: remove multiple links to same target
  }

});
