
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

$('body.domain.domain--show').each(function() {
  var domain = new Mentats.Domain({id: $(this).find('#domain-graph-view').data('id')});
  domain.fetch();

  console.log('domain', domain);

  var domainView = new Mentats.DomainView({
    model: domain,
    el: 'body'
  });

  // test
  console.log(domainView);
});
