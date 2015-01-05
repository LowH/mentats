
$('body.domain.domain--edit').each(function() {
  var domain = Mentats.Domain.find($(this).find('#domain-graph-editor').data('id'));
  if (domain) {
    var domainEditor = new Mentats.DomainEditor({
      model: domain,
      el: 'body'
    });
  }
});
