
(define-resource domain
  (has-one deleted)
  (has-one description)
  (has-one module :having module.domains)
  (has-one name)
  (has-one position)
  (has-many required-domains))

(defun find-domain? (id)
  (let ((domain (find-domain id)))
    (when (and domain (not (domain.deleted domain)))
      domain)))

(defun find-domain! (id)
  (or (find-domain? id)
      (http-error "404 Not found." "Domain not found.")))

(defun domain-uri (domain &key action)
  (let ((uri (uri-for `(/domain ,(domain.id domain)))))
    (ecase action
      ((:edit) (str uri "/edit"))
      ((nil) uri))))

(defun domain-required-domains (domain)
  (remove-if #'domain.deleted (domain.required-domains domain)))

(defun domain-competences (domain)
  (remove-if #'competence.deleted (domain.competences domain)))

(defun domain-competences-json (domain)
  (let ((competences (domain-competences domain)))
    (json:make-object
     `((nodes . ,(mapcar #'competence.id competences))
       (links . ,(mapcan (lambda (competence)
			   (let ((id (competence.id competence)))
			     (mapcar (lambda (req)
				       `((source . ,(competence.id req))
					 (target . ,id)))
				     (competence-required-competences competence))))
			 competences)))
     nil)))

(defun domain-json (domain)
  (facts:with-transaction
    (json:make-object
     `((id . ,(domain.id domain))
       (module . ,(module.id (domain.module domain)))
       (name . ,(domain.name domain))
       (position . ,(or (domain.position domain)
                        {"x": 10, "y": 10}))
       (competences . ,(domain-competences-json domain)))
     nil)))
