
Mentats.CompetencesGraphView = SVGG.Paper.extend({

  nodeRadius: Mentats.competenceRadius,

  initialize: function (options) {
    debug.log('Mentats.CompetencesGraphView', 'new', options);
    this.nodeEvents = {
      click: options.onNodeClick || this.onNodeClick
    };
    SVGG.Paper.prototype.initialize.apply(this, arguments);
    if (options.domain)
      this.$el.addClass('competences-graph').attr('data-domain', options.domain.id);
  },

  onNodeClick: function (node, evt) {
    debug.log('Mentats.CompetencesGraphView', 'onNodeClick', evt, node);
    if (evt.button == 0) {
      Mentats.viewCompetence(node.model.get('id'));
      evt.stopPropagation();
    }
  },

  setNodesBg: function (color, nodes) {
    _.each(nodes, function (n) {
      this.getNodeView(n).rect.fill(color);
    }, this);
  },

  evalStudent: function (student) {
    console.log('evalStudent', student);
    var nodes = this.model.attributes.nodes;
    this.setNodesBg(Mentats.colors.competence.neutral, nodes);
    if (!student) {
      if (this.eval_student) {
        this.stopListening(this.eval_student, 'change:competences', this.evalStudent);
        this.eval_student = null;
      }
    }
    else {
      if (this.eval_student != student) {
        this.stopListening(this.eval_student, 'change:competences', this.evalStudent);
        this.eval_student = student;
        this.listenTo(student, 'change:competences', this.evalStudent);
      }
      var i = this.model.rootNodes();
      while (i.length) {
        var j = [];
        _.each(i, function (node) {
          var validated = student.hasCompetence(node);
          this.getNodeView(node).rect.fill(validated ?
                                           Mentats.colors.competence.validated :
                                           Mentats.colors.competence.open);
          if (validated) {
            _.each(this.model.successors(node), function (succ) {
              if (!_.find(j, succ))
                j.push(succ);
            });
          }
        }, this);
        i = j;
      }
    }
  }

});

Mentats.competencesGraph = function () {
  try {
    var $this = $(this);
    if ($this.children().first().length) {
      debug.log('Mentats.competencesGraph', 'already applied', this);
      return false;
    }
    var domain = Mentats.Domain.find($this.data('domain'));
    var view = new Mentats.CompetencesGraphView({
      model: domain.get('competences'),
      el: this,
      autocrop: true
    });
    debug.log('Mentats.competencesGraph', view);
  }
  catch (e) {
    debug.log('Mentats.competencesGraph', e);
  }
};

$(function () {
  $('.competences-graph:empty').each(Mentats.competencesGraph);
});
