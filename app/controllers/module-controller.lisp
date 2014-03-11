
(defun /module#index ()
  )

(defun /module#show (module)
  (template-let (module)
    (render-view :module :show '.html)))

(defun /module#create ()
  (unless (session-user)
    (http-error "403 Forbidden" "Not authorized"))
  (with-form-data (discipline level)
    (let ((module (add-module 'module.discipline discipline
			      'module.level level
			      'module.owner (session-user))))
      (redirect-to `(/module ,(module.id module))))))

(defun /module#update (module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  )

(defun /module#delete (module)
  (unless (eq (session-user) (module.owner module))
    (http-error "403 Forbidden" "Not authorized"))
  )

(defun /module (&optional module.id)
  (let ((module (when module.id
		  (or (find-module module.id)
		      (http-error "404 Not found" "Module not found.")))))
    (case *method*
      (:GET (if module (/module#show module) (/module#index)))
      (:POST   (/module#create))
      (:PUT    (/module#update module))
      (:DELETE (/module#delete module)))))
