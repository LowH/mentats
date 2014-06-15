
(defun /module#index ()
  (check-can :list 'modules)
  (render-view :module :index '.html))

(defun /module#show (module)
  (check-can :view module)
  (cond ((accept-p :application/json)
	 (render-json (module-json module)))
	(t
	 (template-let (module)
	   (render-view :module :show '.html)))))

(defun /module#edit (module)
  (check-can :edit module)
  (template-let (module)
    (render-view :module :edit '.html)))

(defun /module#create ()
  (check-can :create 'modules)
  (unless (session-user)
    (http-error "403 Forbidden" "Not authorized"))
  (with-form-data (discipline level)
    (redirect-to (module-uri
		  (add-module 'module.discipline discipline
			      'module.level level
			      'module.owner (session-user))
		  :action :edit))))

(defun /module#update (module)
  (check-can :edit module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  (with-form-data (description discipline level)
    (setf (module.description module) description
	  (module.discipline module) discipline
	  (module.level module) level)
    (redirect-to (module-uri module))))

(defun /module#delete (module)
  (check-can :delete module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  (facts:with-transaction
    (setf (module.deleted module) t))
  (redirect-to (user-uri (session-user))))

(defun /module#update-domains (module)
  (check-can :edit module)
  (with-form-data (nodes links)
    (facts:with-transaction
      (let ((old-domains (facts:collect ((?d 'domain.module module)) ?d)))
	(map nil (lambda (node)
		   (cond ((slot-boundp node :id)
			  (let ((domain (find-domain (slot-value node :id))))
			    (unless (and domain (eq module (domain.module domain)))
			      (http-error "404 Not found" "Domain not found"))
			    (check-can :edit domain)
			    (setf (domain.name domain) (slot-value node :name)
				  (domain.position domain) (slot-value node :position))
			    (removef old-domains domain)))
			 (t
			  (let ((domain (add-domain
					  'domain.module module
					  'domain.name (slot-value node :name)
					  'domain.position (slot-value node :position))))
			    (setf (slot-value node :id) (domain.id domain))))))
	     nodes)
	(dolist (d old-domains)
	  (setf (domain.deleted d) t))
	(map nil (lambda (link)
		   (let ((source (find-domain (slot-value link :source)))
			 (target (find-domain (slot-value link :target))))
		     (unless (and source (eq module (domain.module source))
				  target (eq module (domain.module target)))
		       (http-error "404 Not found" "Domain not found"))
		     (check-can :edit target)
		     (unless (facts:bound-p ((target 'domain.required-domains source)))
		       (facts:add (target 'domain.required-domains source)))))
	     links)
	(render-json (module-domains-json module))))))

(defun /module (&optional module.id action)
  (let ((module (when module.id
		  (or (find-module module.id)
		      (http-error "404 Not found" "Module not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit :domains) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if module
		(ecase action
		  ((nil) (/module#show module))
		  ((:edit) (/module#edit module)))
		(/module#index)))
      (:POST   (cond ((and module (eq action :domains))
		      (/module#update-domains module))
		     (t
		      (/module#create))))
      (:PUT    (/module#update module))
      (:DELETE (/module#delete module)))))
