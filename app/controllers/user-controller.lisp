
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

(defun /user#json (user)
  (check-can :view user)
  (render-json (user-json user)))

(defun /user (user.id &optional action)
  (let ((user (or (find-user user.id)
		  (http-error "404 Not found" "User not found.")))
	(action (when action
		  (or (find (string-upcase action) '(:json)
			    :test #'string=)
		      (http-error "404 Not found" "Action not found.")))))
    (case *method*
      (:GET (if (eq action :json)
		(/user#json user)
		(/user#show user))))))
