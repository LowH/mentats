
Mentats.ClassroomView = Backbone.View.extend({

  events: {
    'click .list-group-item.module': 'onModulesListClick'
  },

  initialize: function(options) {
    _.bindAll(this, 'domainSelect', 'moduleSelect',
              'onCompetenceClick', 'onDomainClick', 'onModulesListClick');
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);
    options = options || {};
    this.student = options.student || null;
    this.module = options.module || null;
    this.domain = options.domain || null;
    if (this.domain && !this.module) {
      this.module = Mentats.Module.find(this.domain.get('module'));
    }
  },

  log: debug.logger('Mentats.ClassroomView'),

  domainSelect: function (domain) {
    if (domain && domain != this.domain) {
      this.domain = domain;
      Mentats.router.navigate(Mentats.uri.classroom(this.model, this.module, domain));
      this.renderDomain();
    }
  },

  moduleSelect: function (module) {
    if (module && (module != this.module || this.domain)) {
      this.domain = null;
      this.module = module;
      Mentats.router.navigate(Mentats.uri.classroom(this.model, module));
      this.renderModule();
    }
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
      evt.preventDefault();
      var domain = Mentats.Domain.find(node.model.get('id'));
      this.domainSelect(domain);
    }
  },

  onModulesChange: function () {
    this.log('onModulesChange', this, arguments);
    if (!this.module)
      this.moduleSelect(this.model.get('modules').at(0));
    this.modules.$el.html(this.modules.template({
      classroom: this.model.id,
      modules: this.model.get('modules'),
      active: this.module,
      domain: this.domain
    }));
    this.modules.$domain = this.modules.$el.find('.list-group-item.domain');
  },

  onModulesListClick: function (evt) {
    this.log('onModulesListClick', this);
    if (evt && evt.preventDefault)
      evt.preventDefault();
    this.moduleSelect(Mentats.Module.find($(evt.currentTarget).data('module')));
  },

  onStudentsChange: function () {
    this.students.$el.html(this.students.template({
      classroom: this.model.id,
      students: this.model.get('students'),
      active: this.student
    }));
  },

  render: function () {
    this.setElement($(this.template(this.templateAttributes())));
    this.$main = this.$('.main');
    this.students.$el = this.$('.classroom-students');
    this.modules.$el = this.$('.classroom-modules');
    this.modules.$domain = this.modules.$el.find('.list-group-item.domain');
    this.listenTo(this.model.get('students'), 'change', this.onStudentsChange);
    this.listenTo(this.model.get('modules'), 'change', this.onModulesChange);
    if (this.domain)
      this.renderDomain();
    else if (this.module)
      this.renderModule();
    return this;
  },

  renderModule: function () {
    var module = this.module;
    this.modules.select(module);
    if (this.mainView)
      this.mainView.remove();
    this.$main.empty();
    this.modules.$domain.hide();
    var div = $('<div></div>');
    this.$main.append(div);
    this.mainView = new Mentats.DomainsGraphView({
      el: div,
      model: module.get('domains'),
      module: module,
      onNodeClick: this.onDomainClick,
      autocrop: true
    });
  },

  renderDomain: function () {
    var domain = this.domain;
    this.modules.select(this.module);
    this.modules.$domain
      .data('domain', domain.id)
      .text(domain.get('name'))
      .insertAfter(this.modules.item(this.module))
      .show();
    if (this.mainView)
      this.mainView.remove();
    this.$main.empty();
    var div = $('<div></div>');
    this.$main.append(div);
    var v = new Mentats.CompetencesGraphView({
      domain: domain,
      el: div,
      model: domain.get('competences'),
      onNodeClick: this.onCompetenceClick,
      autocrop: true
    });
    this.mainView = v;
    if (this.student)
      v.evalStudent(this.student);
  },

  selectCompetence: function (competence) {
    this.log('selectCompetence', this, competence);
    this.mainView.setFocus(competence);
    this.$('.main-sub').html('');
  },

  modules: {

    item: function (module) {
      return this.$el.find('[data-module="' + module.id + '"]');
    },

    select: function (module) {
      this.$el.find('.list-group-item.module[data-module]').each(function () {
        var $item = $(this);
        if ($item.data('module') === module.id)
          $item.addClass('active');
        else
          $item.removeClass('active');
      });
    },

    template: _.template($('#modules-panel-template').html())

  },

  students: {
    template: _.template($('#students-panel-template').html())
  },

  teachers: {
    template: _.template($('#teachers-panel-template').html())
  },

  template: _.template($('#classroom-template').html()),

  templateAttributes: function () {
    var attr = _.merge({}, this.model.attributes, {
      studentsTemplate: this.students.template,
      students: this.model.get('students'),
      student: this.student,
      modulesTemplate: this.modules.template,
      modules: this.model.get('modules'),
      module: this.module,
      domain: this.domain,
      teachersTemplate: this.teachers.template,
      teachers: this.model.get('teachers')
    });
    return attr;
  }

});
