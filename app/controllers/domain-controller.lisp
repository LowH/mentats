
(defun /domain#index ()
  (check-can :list 'domains)
  (render-view :domain :index '.html))

(defun /domain#show (domain)
  (check-can :view domain)
  (template-let (domain
		 (module (domain.module domain)))
    (render-view :domain :show '.html)))

(defun /domain#json (domain)
  (check-can :view domain)
  (render-json (domain-json domain)))

(defun /domain#create ()
  (check-can :create 'domains)
  (facts:with-transaction
    (with-form-data (description module name position required-domains)
      (let ((domain (add-domain 'domain.description description
                                'domain.module (find-module! module)
                                'domain.name name
                                'domain.position position)))
        (setf (domain.required-domains domain) required-domains)
        (cond ((accept-p :application/json)
               (render-json (domain-json domain)))
              (:otherwise (redirect-to (domain-uri domain))))))))

(defun /domain#edit (domain)
  (check-can :edit domain)
  (template-let (domain)
    (render-view :domain :edit '.html)))

(defun /domain#update (domain)
  (check-can :edit domain)
  (facts:with-transaction
    (with-form-data (description name position)
      (setf (domain.description domain) description
	    (domain.name domain) name
	    (domain.position domain) position))
    (cond ((accept-p :application/json)
	   (render-json (domain-json domain)))
	  (t
	   (redirect-to (domain-uri domain))))))

(defun /domain#update-competences (domain)
  (check-can :edit domain)
  (facts:with-transaction
    (with-form-data (nodes links)
      (let* ((competences (map 'vector #'find-competence nodes))
	     (requires (map 'vector
			    (lambda (link)
			      (cons (find-competence (json-slot link 'source))
				    (find-competence (json-slot link 'target))))
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
		  (or (find (string-upcase action) '(:edit :competences :json) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (ecase *method*
      (:GET    (if domain
		   (ecase action
		     ((nil) (/domain#show domain))
		     ((:edit) (/domain#edit domain))
		     ((:json) (/domain#json domain)))
		   (/domain#index)))
      (:POST   (cond ((and domain (eq action :competences))
		      (/domain#update-competences domain))
		     (t
		      (/domain#create))))
      (:PUT    (/domain#update domain))
      #+nil(:DELETE (/domain#delete domain)))))
