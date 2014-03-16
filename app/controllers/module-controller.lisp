
(defun module-uri (module)
  (uri-for `(/module ,(module.id module))))

(defun /module#index ()
  (render-view :module :index '.html))

(defun /module#show (module)
  (template-let (module)
    (render-view :module :show '.html)))

(defun /module#create ()
  (unless (session-user)
    (http-error "403 Forbidden" "Not authorized"))
  (with-form-data (discipline level)
    (redirect-to (module-uri
		  (add-module 'module.discipline discipline
			      'module.level level
			      'module.owner (session-user))))))

(defun /module#update (module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  (with-form-data (discipline level)
    (setf (module.discipline module) discipline
	  (module.level module) level)
    (redirect-to (module-uri module))))

(defun /module#delete (module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  (facts:with-transaction
    (unless (module.deleted module)
      (facts:add (module 'module.deleted t))))
  (redirect-to (user-uri (session-user))))

(defun /module (&optional module.id)
  (let ((module (when module.id
		  (or (find-module module.id)
		      (http-error "404 Not found" "Module not found.")))))
    (case *method*
      (:GET (if module (/module#show module) (/module#index)))
      (:POST   (/module#create))
      (:PUT    (/module#update module))
      (:DELETE (/module#delete module)))))
