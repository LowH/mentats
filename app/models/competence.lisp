
(define-resource competence
  (has-one name)
  (has-one parent :having children)
  (has-many requires))

(defun find-competence-by-name (name)
  (facts:first-bound ((?c :is-a 'competence
			  'competence.name name))))

(defun competence-as-cons (c)
  (cons (competence.id c) (competence.name c)))

(defun competence.json (c)
  (json:make-object `((:id . ,(competence.id c))
		      (:name . ,(competence.name c))
		      (:parent . ,(competence.parent c))
		      (:cells . ,(or (competence.cells c) #())))
		    nil))
