/*
 *= require lodash
 *= require jquery
 *= require bootstrap
 *= require backbone
 *= require article
 *= require svg
 *= require svgg
 *= require backbone/model/svgg.graph
 *= require backbone/model/svgg.node
 *= require backbone/model/svgg.link
 *= require backbone/view/svgg.node-view
 *= require backbone/view/svgg.link-view
 *= require backbone/view/svgg.paper
 *= require backbone/view/svgg.editor
 *= require mentats
 *= require backbone/model/mentats.competence
 *= require backbone/model/mentats.domain
 *= require backbone/model/mentats.module
 *= require backbone/view/mentats.competences-graph-view
 *= require backbone/view/mentats.domain-edit
 *= require backbone/view/mentats.domains-graph-view
 *= require backbone/view/mentats.module-edit
 *= require backbone/view/mentats.module-view
 *= require backbone/view/mentats.resource
 *= require mentats.domain
 *= require mentats.module
 */

$(function () {

  $('.competence .edit .btn.edit').click(function () {
    $this = $(this);
    if ($this.hasClass('active')) {
      $(this).removeClass('active');
    } else {
      $(this).addClass('active');
    }
  });

  $('form input').blur(function() {
    $(this).addClass("interacted");
  });

  $('input[data-confirmation-for]').each(function() {
    var conf = this;
    var $conf = $(conf);
    var forId = $conf.data('confirmation-for');
    var forInput = $conf.closest('form').find('input[name="'+forId+'"],input[id="'+forId+'"]').first();
    if (forInput && forInput[0]) {
      var i = forInput[0];
      console.log(conf, 'confirmation for', forId, ' = ', i);
      var f = function() {
	conf.setCustomValidity(i.value === conf.value ? '' :
			       'Le mot de passe n\'est pas identique.');
      };
      $conf.change(f);
      $conf.blur(f);
      forInput.change(f);
      forInput.blur(f);
    }
    else {
      console.log('confirmation for', forId, 'not found.', this);
    }
  });

});
