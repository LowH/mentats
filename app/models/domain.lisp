
(define-resource domain
  (has-one deleted)
  (has-one description)
  (has-one module :having module.domains)
  (has-one name)
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

(defun domain-required-domains (domain)
  (remove-if #'domain.deleted (domain.required-domains domain)))
