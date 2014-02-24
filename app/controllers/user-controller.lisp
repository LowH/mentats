
(defun /user/register ()
  (case *method*
    (:GET (render-view :user :register '.html))
    (:POST (/user/register#post))
    (otherwise (redirect-to `(/user/register)))))

(defun /user (&optional user)
  user)
