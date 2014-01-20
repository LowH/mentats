
(define-resource competence
  (has-one name)
  (has-one parent :many children)
  (has-one cells)
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


;; graphe domaines de competences

;; les graphes de competence, un par domaine


;;domaine : nombres de 0 à 9
