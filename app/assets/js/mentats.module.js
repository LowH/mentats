
Mentats.modules = new Mentats.ModulesCollection();

$('body.module.module--edit').each(function() {
  var module = new Mentats.Module({id: $(this).find('#module-graph-editor').data('id')});
  module.fetch();

  console.log('module', module);
  //module.get('domains').add(new Mentats.Domain({ name: "Plop" }));
  console.log('module domains', module.get('domains'));

  var moduleEditor = new Mentats.ModuleEditor({
    model: module,
    el: 'body'
  });

  // test
  console.log(moduleEditor);
});
