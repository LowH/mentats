
(defun /user (name)
  (let ((user (facts:first-bound ((?user 'user.name name)))))
    (unless user
      (http-error "404 Not found" "User not found."))
    (render-view :user :show '.html)))
