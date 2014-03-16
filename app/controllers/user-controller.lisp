
(defun /user#show (user)
  (template-let (user
		 (modules nil))
    (do-user.modules (module user)
      (unless (module.deleted module)
	(push module modules)))
    (render-view :user :show '.html)))

(defun /user (user.id)
  (let ((user (or (find-user user.id)
		  (http-error "404 Not found" "User not found."))))
    (case *method*
      (:GET (/user#show user)))))
