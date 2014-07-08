
(define-resource competence
  (has-one deleted)
  (has-one description)
  (has-one domain :having domain.competences)
  (has-one name)
  (has-one position)
  (has-many required-competences))

(defun competence-owner (c)
  (domain-owner (competence.domain c)))

(defun competence-uri (competence)
  (uri-for `(/competence ,(competence.id competence))))

(defun find-competence-by-name (name)
  (facts:first-bound ((?c :is-a 'competence
			  'competence.name name))))

(defun competence-as-cons (c)
  (cons (competence.id c) (competence.name c)))

(defun competence-json (c)
  (facts:with-transaction
    (json:make-object
     `((id . ,(competence.id c))
       (name . ,(competence.name c))
       (position . ,(competence.position c)))
     nil)))

(defun competence-required-competences (c)
  (remove-if #'competence.deleted (competence.required-competences c)))
