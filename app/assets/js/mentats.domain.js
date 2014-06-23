
$('body.domain.domain--edit').each(function() {
  var domain = new Mentats.Domain({id: $(this).find('#domain-graph-editor').data('id')});
  domain.fetch();

  console.log('domain', domain);

  var domainEditor = new Mentats.DomainEditor({
    model: domain,
    el: 'body'
  });

  // test
  console.log(domainEditor);
});
