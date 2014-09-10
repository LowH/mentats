
Mentats.ModulesCollectionView = Backbone.View.extend({

  initialize: function (options) {
    _.bindAll(this, 'render');
    Backbone.View.prototype.initialize.apply(this, arguments);
    console.log('new Mentats.ModulesCollectionView', this);
    this.listenTo(this.model, 'change', this.render);
    //this.listenTo(this.model, 'change:inLibrary', this.onLibraryChange);
    //var classrooms = this.model.get('inClassrooms');
    //this.listenTo(classrooms, 'add', this.onClassroomAdd);
    //this.listenTo(classrooms, 'remove', this.onClassroomRemove);
  },
