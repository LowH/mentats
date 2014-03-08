
(test /
  (test-request (:get "/")
    (is (dom:document-p *doc*))
    (is (eq :utf-8 priest:*charset*)))
  (test-request (:get "/assets/app.css")
    (is (eq :text/css priest:*content-type*)))
  (test-request (:get "/assets/app.js")
    (is (eq :application/javascript priest:*content-type*)))
  (test-request (:get "/favicon.ico")
    (is (eq :image/x-icon priest:*content-type*))))

(test /account/register
  (is-a string #1=(uri-for '(/account/register)))
  (is (not (emptyp #1#)))
  (test-request (:get #1#)
    (has-dom-element "form#register")
    (has-dom-element "form#register input[type=email][name=email]")
    (has-dom-element "form#register input[type=password][name=password]")
    (has-dom-element "form#register button[type=\"submit\"]"))
  (test-request (:post #1#)
    (is (dom:document-p priest:*doc*))))
