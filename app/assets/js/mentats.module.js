
$(function() {

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

});
