
(defun /domain#index ()
  (check-can :list 'domains)
  (render-view :domain :index '.html))

(defun /domain#show (domain)
  (check-can :view domain)
  (cond ((accept-p :application/json)
	 (render-json (domain-json domain)))
	(t
	 (template-let (domain)
	   (render-view :domain :show '.html)))))

(defun /domain#edit (domain)
  (check-can :edit domain)
  (template-let (domain)
    (render-view :domain :edit '.html)))

(defun parse-competence-json (node domain)
  (cond ((slot-boundp node :id)
	 (let ((competence (find-competence (slot-value node :id))))
	   (unless (and competence (eq domain (competence.domain competence)))
	     (http-error "404 Not found" "Competence not found"))
	   (check-can :edit competence)
	   (setf (competence.name competence) (slot-value node :name)
		 (competence.position competence) (slot-value node :position))
	   competence))
	(t
	 (let ((competence (add-competence
			     'competence.domain domain
			     'competence.name (slot-value node :name)
			     'competence.position (slot-value node :position))))
	   (setf (slot-value node :id) (competence.id competence))
	   competence))))

(defun /domain#update-competences (domain)
  (check-can :edit domain)
  (facts:with-transaction
    (with-form-data (nodes links)
      (let* ((competences (map 'vector (lambda (node)
					 (parse-competence-json node domain))
			       nodes))
	     (requires (map 'vector
			    (lambda (link)
			      (cons (elt competences (slot-value link :source))
				    (elt competences (slot-value link :target))))
			    links)))
	(facts:with ((?d 'competence.domain domain))
	  (if (find ?d competences)
	      (facts:with ((?d 'competence.required-competences ?r))
		(unless (find-if (lambda (req)
				   (and (eq (car req) ?r)
					(eq (cdr req) ?d)))
				 requires)
		  (facts:rm ((?d 'competence.required-competences ?r)))))
	      (setf (competence.deleted ?d) t)))
	(map nil (lambda (req)
		   (destructuring-bind (source . target) req
		     (check-can :edit target)
		     (unless (facts:bound-p ((target 'competence.required-competences source)))
		       (facts:add (target 'competence.required-competences source)))))
	     requires)))
    (render-json (domain-competences-json domain))))

(defun /domain (&optional domain.id action)
  (let ((domain (when domain.id
		  (or (find-domain domain.id)
		      (http-error "404 Not found" "Domain not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit :competences) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (ecase *method*
      (:GET    (if domain
		   (ecase action
		     ((nil) (/domain#show domain))
		     ((:edit) (/domain#edit domain)))
		   (/domain#index)))
      (:POST   (cond ((and domain (eq action :competences))
		      (/domain#update-competences domain))
		     (t
		      (/domain#create))))
      (:PUT    (/domain#update domain))
      (:DELETE (/domain#delete domain)))))
