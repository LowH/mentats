
Mentats.modules = new Mentats.ModulesCollection();

$('body.module.module--edit').each(function() {
  var module = new Mentats.Module({id: $(this).find('#module-graph-editor').data('id')});
  module.fetch();

  console.log('module', module);

  var moduleEditor = new Mentats.ModuleEditor({
    model: module,
    el: 'body'
  });

  // test
  console.log(moduleEditor);
});

$('body.module.module--show').each(function() {
  var module = new Mentats.Module({id: $(this).find('#module-graph-view').data('id')});
  module.fetch();

  console.log('module', module);

  var moduleView = new Mentats.ModuleView({
    model: module,
    el: 'body'
  });

  // test
  console.log(moduleView);
});
