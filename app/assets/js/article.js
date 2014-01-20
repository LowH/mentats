$(function () {

  var article = {
    live: function () {
      var $article = $(this);
      console.log('article', $article);
      $article.find('button[role="show"]').click(function() {
	$article.find('.header button').removeClass('active');
	$article.find('.header button[role="show"]').addClass('active');
	$article.find('.display').show();
	$article.find('.edit').hide();
	$article.find('.preview').hide();
      });
      $article.find('button[role="edit"]').click(function() {
	$article.find('.header button').removeClass('active');
	$article.find('.header button[role="edit"]').addClass('active');
	$article.find('.display').hide();
	$article.find('.edit').show();
	$article.find('.preview').hide();
      });
      $article.find('button[role="preview"]').click(function() {
	$article.find('.header button').removeClass('active');
	$article.find('.header button[role="preview"]').addClass('active');
	$article.find('.display').hide();
	$article.find('.edit').hide();
	$article.find('.preview').show();
      });
      $article.find('button[role="delete"]').click(function() {
	var a = $article.data('article');
	return confirm('Supprimer l\'article "' + a.title + '" ?');
      });
    }
  };

  $('.article').each(article.live);

});
