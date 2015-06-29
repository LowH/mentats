
Mentats.ClassroomView = Backbone.View.extend({

  events: {
    'click .list-group-item.module': 'onModulesListClick'
  },

  initialize: function(options) {
    _.bindAll(this, 'domainSelect', 'moduleSelect',
              'onCompetenceClick', 'onDomainClick', 'onModulesListClick');
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);
    this.student = null;
    this.students = new Mentats.StudentsCollection;
    this.listenTo(this.students, 'reset', this.onStudentsReset);
    this.module = null;
    this.domain = null;
    this.listenTo(this.model.get('modules'), 'change', this.onModulesChange);
    this.listenTo(this.model.get('modules'), 'change', this.update);
    this.listenTo(this.model.get('students'), 'change', this.update);
    this.listenTo(this.model, 'change', this.update);
  },

  log: debug.logger('Mentats.ClassroomView'),

  domainSelect: function (domain) {
    this.domain = domain;
    Mentats.router.navigate('/classroom/' + this.model.id + '/' + this.module.id
                            + '/' + domain.id);
    this.domainListItem
      .data('domain', domain.id)
      .text(domain.get('name'))
      .insertAfter(this.moduleListItem(this.module))
      .show();
    var div = $('<div></div>');
    this.$('.main').html('').append(div);
    var v = new Mentats.CompetencesGraphView({
      domain: domain,
      el: div,
      model: domain.get('competences'),
      onNodeClick: this.onCompetenceClick,
      autocrop: true
    });
    if (this.student)
      v.evalStudent(this.student);
    this.mainView = v;
    v.$el.click(_.bind(function () {
      this.selectCompetence(null);
    }, this));
  },

  moduleDeselect: function () {
    if (this.module) {
      this.log('moduleDeselect', this.module);
      this.domainListItem.hide();
      this.$('.modules.panel .list-group-item.module').removeClass('active');
      if (this.mainView)
        this.mainView.remove();
      this.$('.main, .main-sub').html('');
      this.module = null;
    }
  },

  moduleListItem: function (module) {
    return this.$('.modules.panel .list-group-item.module[data-module="'
                  + module.id + '"]');
  },

  moduleSelect: function (module) {
    if (!module)
      return;
    var domains = module.get('domains');
    if (!domains)
      return;
    this.domain = null;
    this.moduleDeselect();
    this.module = module;
    Mentats.router.navigate('/classroom/' + this.model.id + '/' + module.id);
    this.log('moduleSelect', module);
    var div = $('<div></div>');
    this.$('.main').append(div);
    var v = new Mentats.DomainsGraphView({
      el: div,
      model: domains,
      module: module,
      onNodeClick: this.onDomainClick,
      autocrop: true
    });
    this.mainView = v;
    this.moduleListItem(module).addClass('active');
  },

  onCompetenceClick: function (node, evt) {
    this.log('onCompetenceClick', this, node, evt);
    if (evt.button == 0) {
      if (this.student) {
        if (this.student.hasCompetence(node.model))
          this.student.removeCompetence(node.model);
        else
          this.student.addCompetence(node.model);
        this.student.save();
      }
      evt.stopPropagation();
    }
  },

  onDomainClick: function (node, evt) {
    this.log('onDomainClick', this, node, evt);
    if (evt.button == 0) {
      var domain = Mentats.Domain.find(node.model.get('id'));
      this.domainSelect(domain);
      evt.stopPropagation();
    }
  },

  onModulesChange: function () {
    this.log('onModulesChange', this, arguments);
    if (!this.module && !this.changingModules) {
      this.changingModule = true;
      this.moduleSelect(this.model.get('modules').at(0));
      this.changingModule = false;
    }
  },

  onModulesListClick: function (evt) {
    this.log('onModulesListClick', this);
    this.moduleSelect(Mentats.Module.find($(evt.currentTarget).data('module')));
    evt.preventDefault();
  },

  onStudentsReset: function () {
    this.student = this.students.length ? this.students.at(0) : null;
    if (this.mainView && this.mainView.evalStudent) {
      this.mainView.evalStudent(this.student);
    }
  },

  render: function () {
    this.setElement($('<div>' + this.template(this.templateAttributes()) + '</div>'));
    this.studentsView = new Mentats.StudentsSelectorView({
      el: this.$('.students .list-group')[0],
      model: {
        available: this.model.get('students'),
        selected: this.students
      }
    });
    this.domainListItem = this.$('.modules.panel .list-group-item.domain');
    return this;
  },

  selectCompetence: function (competence) {
    this.log('selectCompetence', this, competence);
    this.mainView.setFocus(competence);
    this.$('.main-sub').html('');
  },

  template: _.template($('#classroom-template').html()),

  templateAttributes: function () {
    var attr = _.merge({}, this.model.attributes, {
      students: this.model.get('students'),
      modules: this.model.get('modules'),
      teachers: this.model.get('teachers')
    });
    return attr;
  },

  update: function () {
    this.$el.html(this.template(this.templateAttributes()));
  }

});
