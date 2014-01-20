
(defmacro current-user ()
  `(session-get :user))

(trace session session-attach session-get)

(defun /session/login#get ()
  (render-view :session :login '.html))

(defun check-password (login pass)
  (string= login pass))

(defun /session/login#post ()
  (with-form-data (l p redirect-to)
    (unless (check-password l p)
      (http-error "403 Forbidden" "Login/pass not found"))
    (session-reset)
    (setf (current-user) l)
    (redirect-to (or (and redirect-to
			  (char= #\/ (char redirect-to 0))
			  redirect-to)
		     "/"))))

(defun /session/login ()
  (ecase *method*
    ((:GET) (/session/login#get))
    ((:POST) (/session/login#post))))

(defun /session/logout (&optional redirect-to)
  (setf (current-user) nil)
  (session-end)
  (redirect-to (or (and redirect-to
			(char= #\/ (char redirect-to 0))
			redirect-to)
		   "/")))
