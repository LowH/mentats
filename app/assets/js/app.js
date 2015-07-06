/*
 *= require lodash
 *= require lodash.equalp
 *= require jquery
 *= require bootstrap
 *  require bootstrap/material-design
 *= require backbone
 *= require article
 *= require svg
 *= require svgg
 *= require debug
 *= require backbone/cache
 *= require backbone/model/svgg.node
 *= require backbone/model/svgg.link
 *= require backbone/model/svgg.graph
 *= require backbone/view/svgg.node-view
 *= require backbone/view/svgg.link-view
 *= require backbone/view/svgg.paper
 *= require backbone/view/svgg.editor
 *= require mentats
 *= require mentats.uri
 *= require backbone/router/mentats.router
 *= require backbone/model/mentats.student
 *= require backbone/model/mentats.classroom
 *= require backbone/model/mentats.competence
 *= require backbone/model/mentats.domain
 *= require backbone/model/mentats.module
 *= require backbone/model/mentats.resource
 *= require backbone/model/mentats.user
 *= require backbone/view/mentats.student-selector-view
 *= require backbone/view/mentats.classroom-edit-view
 *= require backbone/view/mentats.classroom-view
 *= require backbone/view/mentats.competences-graph-view
 *= require backbone/view/mentats.competence-view
 *= require backbone/view/mentats.domain-edit
 *= require backbone/view/mentats.domains-graph-view
 *= require backbone/view/mentats.module-edit
 *= require backbone/view/mentats.module-view
 *= require backbone/view/mentats.module-thumbnail-view
 *= require backbone/view/mentats.modules-selector-view
 *= require backbone/view/mentats.resource-view
 *= require mentats.domain
 *= require mentats.module
 */

$(function () {

  //debug.all = true;

  Mentats.loader.init();

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
      debug.log('form', conf, 'confirmation for', forId, ' = ', i);
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
      debug.log('form', 'confirmation for', forId, 'not found.', this);
    }
  });

  $('a[data-method]').click(function (evt) {
    var $this = $(this);
    debug.log('form', 'click', $this.attr('href'), $this.data('method'), evt);
    $.ajax($this.attr('href'), {
      type: $this.data('method'),
      success: function (xhr) {
	debug.log('form', 'success', xhr);
      }
    });
    evt.preventDefault();
    return true;
  });

  Mentats.router = new Mentats.Router();
  Backbone.history.start({pushState: true});

  if ($.material)
    $.material.init();
});
