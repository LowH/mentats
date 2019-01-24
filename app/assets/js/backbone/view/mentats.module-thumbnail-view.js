
Mentats.ModuleThumbnailView = Backbone.View.extend({

  events: {
    'click .toggle-library': 'onLibraryClick',
    'click .toggle-classroom': 'onClassroomClick'
  },

  initialize: function (options) {
    _.bindAll(this, 'onLibraryChange', 'onLibraryClick', 'onClassroomAdd',
	      'onClassroomClick', 'onClassroomRemove', 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    this.log('new', this);
    this.$el.addClass('module thumbnail')
      .attr('data-module', this.model.id);
    this.listenTo(this.model, 'change', this.render);
    //this.listenTo(this.model, 'change:inLibrary', this.onLibraryChange);
    //var classrooms = this.model.get('inClassrooms');
    //this.listenTo(classrooms, 'add', this.onClassroomAdd);
    //this.listenTo(classrooms, 'remove', this.onClassroomRemove);
  },

  log: debug.logger('Mentats.ModuleThumbnailView'),

  onLibraryChange: function () {
    this.log('onLibraryChange', arguments);
    if (this.model.get('inLibrary')) {
      this.$('.toggle-library i').attr('class', 'fa fa-star');
      this.$('.toggle-library').attr('title', 'Enlever de ma bibliothèque');
    }
    else {
      this.$('.toggle-library i').attr('class', 'fa fa-star-o');
      this.$('.toggle-library').attr('title', 'Ajouter à ma bibliothèque');
    }
  },

  onLibraryClick: function (evt) {
    this.log('onLibraryClick', arguments);
    var attrs = { 'inLibrary': !this.model.get('inLibrary') };
    this.model.set(attrs);
    Backbone.sync('update', this.model);
    evt.preventDefault();
  },

  onClassroomAdd: function (classroom) {
    this.log('onClassroomAdd', arguments);
    var li = this.$('.menu li.toggle-classroom[data-classroom="'+classroom.id+'"]');
    li.find('i').attr('class', 'fa fa-minus');
    li.find('span.toggle').text('Enlever de');
  },

  onClassroomClick: function (evt) {
    this.log('onClassroomClick', this, arguments);
    var id = $(evt.currentTarget).data('classroom');
    var classrooms = this.model.get('inClassrooms');
    this.log(id, classrooms);
    var c = classrooms.get(id);
    if (c)
      classrooms.remove(c);
    else
      classrooms.add(new Mentats.Classroom({id: id}));
    Backbone.sync('update', classrooms);
    this.log(this);
    evt.preventDefault();
  },

  onClassroomRemove: function (classroom) {
    this.log('onClassroomRemove', arguments);
    var li = this.$('.menu li.toggle-classroom[data-classroom="'+classroom.id+'"]');
    li.find('i').attr('class', 'fa fa-plus');
    li.find('span.toggle').text('Ajouter à');
  },

  render: function () {
    var owner = this.model.get('owner');
    var attrs = _.extend(_.clone(this.model.attributes), {
        owner: owner,
        name: owner ? owner.name : "",
    });
    this.log('render', attrs);
    this.$el.html(this.template(attrs))
      .css('background-image', 'url(' + this.model.get('backgroundImage') + ')');
    return this;
  },

  template: _.template($('#module-thumbnail-template').html())

});

$(function () {
  $('div.module.thumbnail').each(function () {
    var m = Mentats.Module.find($(this).data('module'));
    var v = new Mentats.ModuleThumbnailView({
      el: this,
      model: m
    }).render();
  });
});
