
$(function() {

  $('body.module.module--edit').each(function() {
    var module = Mentats.Module.find($(this).find('#module-graph-editor').data('id'));
    if (module) {
      var moduleEditor = new Mentats.ModuleEditor({
	model: module,
	el: 'body'
      });
    }
  });

});
