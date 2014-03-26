
(defun /module#index ()
  (check-can :list 'modules)
  (render-view :module :index '.html))

(defun /module#show (module)
  (check-can :view module)
  (template-let (module)
    (render-view :module :show '.html)))

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
    (unless (module.deleted module)
      (facts:add (module 'module.deleted t))))
  (redirect-to (user-uri (session-user))))

(defun /module (&optional module.id action)
  (let ((module (when module.id
		  (or (find-module module.id)
		      (http-error "404 Not found" "Module not found."))))
	(action (when action
		  (or (find (string-upcase action) '(:edit) :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if module
		(ecase action
		  ((nil) (/module#show module))
		  ((:edit) (/module#edit module)))
		(/module#index)))
      (:POST   (/module#create))
      (:PUT    (/module#update module))
      (:DELETE (/module#delete module)))))
