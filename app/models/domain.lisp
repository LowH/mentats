
(define-resource domain
  (has-one deleted)
  (has-one name)
  (has-one module :having module.domains)
  (has-one position)
  (has-many required-domains))

(defun domain-uri (domain)
  (uri-for `(/domain ,(domain.id domain))))

(defun domain-json (domain)
  (facts:with-transaction
    (json:make-object
     `((id . ,(domain.id domain))
       (name . ,(domain.name domain))
       (position . ,(domain.position domain)))
     nil)))
