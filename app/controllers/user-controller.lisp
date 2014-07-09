
(defun /user#show (user)
  (check-can :view user)
  (template-let (user
		 (modules nil)
		 (classrooms nil))
    (do-user.modules (module user)
      (unless (module.deleted module)
	(push module modules)))
    (do-user.classrooms (c user)
      (unless (classroom.deleted c)
	(push c classrooms)))
    (render-view :user :show '.html)))

(defun /user (user.id)
  (let ((user (or (find-user user.id)
		  (http-error "404 Not found" "User not found."))))
    (case *method*
      (:GET (/user#show user)))))
