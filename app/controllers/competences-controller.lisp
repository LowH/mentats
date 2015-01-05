
(defun /competence#show (competence)
  (check-can :view competence)
  (facts:with-transaction
    (let* ((domain (competence.domain competence))
	   (module (domain.module domain)))
      (template-let (module
		     domain
		     competence
		     (resources nil))
	(facts:with ((?r :is-a 'resource
			 'resource.competence competence))
	  (unless (resource.deleted ?r)
	    (push ?r resources)))
	(render-view :competence :show '.html)))))

(defun /competence#json (competence)
  (check-can :view competence)
  (render-json (competence-json competence)))

(defun /competence#create ()
  (with-form-data (competence.name)
    (cond ((emptyp competence.name) (redirect-to `(/competence)))
	  (:otherwise (add-competence 'competence.name competence.name)
		      (redirect-to `(/competence :name ,competence.name))))))

(defun /competence#update (competence)
  (check-can :edit competence)
  (facts:with-transaction
    (with-form-data (description name position)
      (setf (competence.description competence) description
	    (competence.name competence) name
	    (competence.position competence) position))
  (cond ((accept-p :application/json)
	 (render-json (competence-json competence)))
	(t
	 (redirect-to (competence-uri competence))))))

(defmacro with-assoc (bindings alist &body body)
  (let ((g!alist (gensym "ALIST-")))
    `(let ((,g!alist ,alist))
       (symbol-macrolet
	   ,(mapcar (lambda (b)
		      (let ((var (if (consp b) (car b) b))
			    (key (if (consp b) (cdr b) (intern (symbol-name b)
							       :keyword))))
			`(,var (cdr (assoc ,key ,g!alist)))))
		    bindings)
	 ,@body))))

(defun /competence (&optional id action)
  (let ((c (when id
	     (or (find-competence id)
		 (http-error "404 Not found" "No competence with ID ~S" id))))
	(action (when action
		  (or (find (string-upcase action) '(:json) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (ecase *method*
      ((:GET)    (cond ((null c) (/competence#index))
		       ((null action) (/competence#show c))
		       ((eq :json action) (/competence#json c))))
      ((:POST)   (/competence#create))
      ((:PUT)    (/competence#update c))
      ((:DELETE) (/competence#delete c)))))
