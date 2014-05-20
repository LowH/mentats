Mentats.GraphElementView = joint.dia.ElementView.extend({

  initialize: function () {
    _.bindAll(this, 'focus', 'blur', 'promptName', 'linkBtn');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    this.on({
      'focus': this.focus,
      'blur': this.blur
    });
  },
  
  focus: function () {
    this.el.classList.add('focused');
    //this.$el.find('text.name').on('mousedown', this.promptName);
    this.$el.find('.link.btn').on('mousedown', this.linkBtn);
  },

  blur: function () {
    this.el.classList.remove('focused');
    //this.$el.find('text.name').off('mousedown', this.promptName);
    this.$el.find('.link.btn').off('mousedown', this.linkBtn);
  },

  promptName: function (evt) {
    this.model.promptName();
    evt.preventDefault();
    evt.stopPropagation();
  },

  linkBtn: function (evt) {
    this.paper.spawnLink({ id: this.model.id }, evt);
    evt.preventDefault();
    evt.stopPropagation();
  },

});
