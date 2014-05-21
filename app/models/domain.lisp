
(define-resource domain
  (has-one name)
  (has-one module :having domains)
  (has-many required-domains))

(defun domain-uri (domain)
  (uri-for `(/domain ,(domain.id domain))))
