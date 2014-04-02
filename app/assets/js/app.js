/*
 *= require jquery
 *= require jquery.sortElements
 *= require bootstrap
 *= require joint.nojquery
 *= require joint.layout.DirectedGraph
 *= require article
 *= require mentats
 *= require graph
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
