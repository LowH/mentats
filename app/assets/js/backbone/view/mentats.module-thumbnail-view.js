
Mentats.ModuleThumbnailView = Backbone.View.extend({

  events: {
    'click .toggle-library': 'onLibraryClick',
    'click .toggle-classroom': 'onClassroomClick'
  },

  initialize: function (options) {
    _.bindAll(this, 'onLibraryChange', 'onLibraryClick', 'onClassroomAdd',
	      'onClassroomClick', 'onClassroomRemove', 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModuleThumbnailView', this);
    this.listenTo(this.model, 'change', this.render);
    //this.listenTo(this.model, 'change:inLibrary', this.onLibraryChange);
    //var classrooms = this.model.get('inClassrooms');
    //this.listenTo(classrooms, 'add', this.onClassroomAdd);
    //this.listenTo(classrooms, 'remove', this.onClassroomRemove);
  },

  onLibraryChange: function () {
    console.log('Mentats.ModuleThumbnailView.onLibraryChange', arguments);
    if (this.model.get('inLibrary')) {
      this.$('.toggle-library i').attr('class', 'icon-star');
      this.$('.toggle-library').attr('title', 'Enlever de ma bibliothèque');
    }
    else {
      this.$('.toggle-library i').attr('class', 'icon-star-empty');
      this.$('.toggle-library').attr('title', 'Ajouter à ma bibliothèque');
    }
  },

  onLibraryClick: function (evt) {
    console.log('Mentats.ModuleThumbnailView.onLibraryClick', arguments);
    var attrs = { 'inLibrary': !this.model.get('inLibrary') };
    this.model.set(attrs);
    Backbone.sync('update', this.model);
    evt.preventDefault();
  },

  onClassroomAdd: function (classroom) {
    console.log('Mentats.ModuleThumbnailView.onClassroomAdd', arguments);
    var li = this.$('.menu li.toggle-classroom[data-classroom="'+classroom.id+'"]');
    li.find('i').attr('class', 'icon-minus');
    li.find('span.toggle').text('Enlever de');
  },

  onClassroomClick: function (evt) {
    console.log('Mentats.ModuleThumbnailView.onClassroomClick', this, arguments);
    var id = $(evt.currentTarget).data('classroom');
    var classrooms = this.model.get('inClassrooms');
    console.log(id, classrooms);
    var c = classrooms.get(id);
    if (c)
      classrooms.remove(c);
    else
      classrooms.add(new Mentats.Classroom({id: id}));
    Backbone.sync('update', classrooms);
    console.log(this);
    evt.preventDefault();
  },

  onClassroomRemove: function (classroom) {
    console.log('Mentats.ModuleThumbnailView.onClassroomRemove', arguments);
    var li = this.$('.menu li.toggle-classroom[data-classroom="'+classroom.id+'"]');
    li.find('i').attr('class', 'icon-plus');
    li.find('span.toggle').text('Ajouter à');
  },

  render: function () {
    console.log('Mentats.ModuleThumbnailView.render', this.model.attributes.owner);
    this.$el.html(this.template(this.model.attributes))
      .css('background-image', 'url(' + this.model.get('backgroundImage') + ')');
    return this;
  },

  template: _.template($('#module-thumbnail-template').html())

});

$(function () {
  $('div.module.thumbnail').each(function () {
    var m = Mentats.getModule($(this).data('module'));
    var v = new Mentats.ModuleThumbnailView({
      el: this,
      model: m
    }).render();
  });
});
