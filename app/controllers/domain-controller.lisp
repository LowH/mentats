
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

(defun /domain (&optional domain.id action)
  (let ((domain (when domain.id
		  (or (find-domain domain.id)
		      (http-error "404 Not found" "Domain not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (ecase *method*
      (:GET    (if domain
		   (ecase action
		     ((nil) (/domain#show domain))
		     ((:edit) (/domain#edit domain)))
		   (/domain#index)))
      (:POST   (/domain#create))
      (:PUT    (/domain#update domain))
      (:DELETE (/domain#delete domain)))))
